import express from 'express';
import { createServer } from 'http';
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server)

let queueLength = 0;
let queueMax = 3
let whitePlayers = []
let blackPlayers = []
let suggestedMoves = []
let votes = 0
let finalMove
let turn = 'white'
let playersReady = []

function mostFrequentPropertyValues(array) {
  // Count the frequency of each move object
  const frequencyMap = array.reduce((acc, obj) => {
    const moveString = JSON.stringify(obj.move);
    acc[moveString] = (acc[moveString] || 0) + 1;
    return acc;
  }, {});

  // Find the highest frequency
  const maxFrequency = Math.max(...Object.values(frequencyMap));

  // Find the move objects with the highest frequency
  const mostFrequentMoves = Object.keys(frequencyMap).filter(
    key => frequencyMap[key] === maxFrequency
  );

  // Extract the move objects and add the numberOfVotes property
  const moveObjectsWithVotes = mostFrequentMoves.map(moveString => {
    const move = JSON.parse(moveString);
    const { fen, side } = array.find(obj => JSON.stringify(obj.move) === moveString);
    return { move, side, numberOfVotes: 0, fen };
  });

  return moveObjectsWithVotes;
}

// Shuffle function using Fisher-Yates algorithm
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function arrLengthCheck (array1,array2){
return array1.length === array2.length ? true : false;
}

function resetAndSwitchTurns() {
  suggestedMoves = []
  votes = 0
  finalMove = null
  turn = turn === 'white' ? 'black' : 'white'

  io.emit('receiveResetAndTurn', turn)
}

io.on('connection', (socket) => {
  console.log(socket.id, 'connected')

  socket.on('joinQueue', () => {
    if (queueLength < queueMax) {
      queueLength++;
      io.emit('updateQueue', queueLength)
      // console.log(socket.id, 'player joined');
    }

    if (queueLength === queueMax) {
      const players = io.sockets.sockets.values();
      const playerArray = Array.from(players);
      
      // Shuffle the player array randomly
      const shuffledPlayers = shuffleArray(playerArray);
      
      // Calculate the midpoint index
      const midpointIndex = Math.ceil(playerArray.length / 2);
      
      // Divide the shuffled array into two teams
      whitePlayers = shuffledPlayers.slice(0, midpointIndex);
      blackPlayers = shuffledPlayers.slice(midpointIndex);
      
      // Assign teams and emit events
      whitePlayers.forEach((player) => {
        player.join('white');
        player.emit('receiveAssignTeams', 'white')
      });
      
      blackPlayers.forEach((player) => {
        player.join('black');
        player.emit('receiveAssignTeams', 'black')
      });
  
      console.log('white team', whitePlayers.length)
      console.log('black team', blackPlayers.length)
    }
  });

  socket.on('cancelQueue', () => {
    if (queueLength > 0) {
      queueLength--;
      io.emit('updateQueue', queueLength)
      // console.log(socket.id, 'player cancelled');
    }
  })

  socket.on('playerReady', (data) => {
    playersReady.push(data)
    console.log(playersReady)
    if (playersReady.length === blackPlayers.length + whitePlayers.length) {
      io.emit('playersReady')
    }
  })

  socket.on('sendMove', (data) => {
    suggestedMoves.push(data)

    if (turn === 'black') {
      if (blackPlayers.length === 1 && arrLengthCheck(blackPlayers, suggestedMoves)) {
        io.emit("receiveFinalMove", suggestedMoves[0]) // send turn also
        resetAndSwitchTurns()
      }
      
      if (blackPlayers.length > 1) {
        io.to(turn).emit("receiveMoves", suggestedMoves)

        if (arrLengthCheck(blackPlayers, suggestedMoves)) {
          if (mostFrequentPropertyValues(suggestedMoves).length === 1) {
            io.emit("receiveFinalMove", suggestedMoves[0])
            resetAndSwitchTurns()
          } else {
            io.to(turn).emit('allTeamMoved', suggestedMoves)
          }
        }
      }
    }
    
    if (turn === 'white') {
      if (whitePlayers.length === 1 && arrLengthCheck(whitePlayers, suggestedMoves)) {
        io.emit("receiveFinalMove", suggestedMoves[0])
        resetAndSwitchTurns()
      }
      
      if (whitePlayers.length > 1) {
        io.to(turn).emit("receiveMoves", suggestedMoves, turn)

        if (arrLengthCheck(whitePlayers, suggestedMoves)) {
          if (mostFrequentPropertyValues(suggestedMoves).length === 1) {
            io.emit("receiveFinalMove", suggestedMoves[0])
            resetAndSwitchTurns()
          } else {
            io.to(turn).emit('allTeamMoved', suggestedMoves)
          }
        }
      }
    }
  })

  socket.on('getMostFrequent', (data) => {
    io.to(turn).emit("receiveMostFrequent", mostFrequentPropertyValues(data));
  })

  socket.on('voteMove', (data) => {
    data.mostFrequent[data.index].numberOfVotes++;

    io.to(turn).emit("receiveVotes", data.mostFrequent);

    votes++;

    if ((turn === "black" && votes === blackPlayers.length) || (turn === "white" && votes === whitePlayers.length)) {
        const allEqualVotes = data.mostFrequent.every(move => move.numberOfVotes === data.mostFrequent[0].numberOfVotes);

        if (allEqualVotes) {
            data.mostFrequent.forEach(move => move.numberOfVotes = 0);
            io.to(turn).emit("revoteNeeded", "All moves have the same number of votes. Revote required.", data.mostFrequent);
            votes = 0; 
        } else {
            const maxVotesMove = data.mostFrequent.reduce((prev, current) => (prev.numberOfVotes > current.numberOfVotes) ? prev : current);
            io.emit("receiveFinalMove", maxVotesMove);
            resetAndSwitchTurns();
        }
    }
});

  socket.on('disconnect', () => {
    if (queueLength > 0) {
      queueLength--;
      io.emit('updateQueue', queueLength)
      console.log('player disconnected');
    }
  });
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
