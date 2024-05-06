import express from 'express';
import { createServer } from 'http';
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server);

let queueLength = 0;
let queueMax = 3
let whitePlayers = []
let blackPlayers = []
let suggestedMoves = []
let votes = 0
let finalMove
let turn = 'White'
let sentOnce = false

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

function handleTurnChange(io) {
  turn = turn === 'White' ? 'Black' : 'White';
  io.emit('turnChange', turn);
}

io.on('connection', (socket) => {
  console.log(socket.id, 'connected')    

  socket.emit('turnChange', turn);

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
        player.join('White');
        player.emit('assignTeam', { player: player.id, side: 'White' });
      });
    
      blackPlayers.forEach((player) => {
        player.join('Black');
        player.emit('assignTeam', { player: player.id, side: 'Black' });
      });

      console.log('white team:', whitePlayers.length)
      console.log('black team:', blackPlayers.length)
    }
  });

  socket.on('cancelQueue', () => {
    if (queueLength > 0) {
      queueLength--;
      io.emit('updateQueue', queueLength)
      // console.log(socket.id, 'player cancelled');
    }
  })

  socket.on('sendMove', (data) => {
    suggestedMoves.push(data)

    if (turn === 'Black') {
      if (blackPlayers.length === 1 && arrLengthCheck(blackPlayers, suggestedMoves)) {
        io.emit("receiveFinalMove", suggestedMoves[0])
        handleTurnChange(io)
      }
      
      if (blackPlayers.length > 1) {
        io.to(data.side).emit("receiveMoves", suggestedMoves)

        if (mostFrequentPropertyValues(suggestedMoves).length === 1) {
          io.emit("receiveFinalMove", suggestedMoves[0])
          handleTurnChange(io)
        } else {
          io.to(data.side).emit('allTeamVoted', suggestedMoves)
        }
      }
    }
    
    if (turn === 'White') {
      if (whitePlayers.length === 1 && arrLengthCheck(whitePlayers, suggestedMoves)) {
        io.emit("receiveFinalMove", suggestedMoves[0])
        handleTurnChange(io)
      }
      
      if (whitePlayers.length > 1) {
        io.to(data.side).emit("receiveMoves", suggestedMoves)

        if (arrLengthCheck(whitePlayers, suggestedMoves)) {
          if (mostFrequentPropertyValues(suggestedMoves).length === 1) {
            io.emit("receiveFinalMove", suggestedMoves[0])
            handleTurnChange(io)
          } else {
            io.to(data.side).emit('allTeamVoted', suggestedMoves)
          }
        }
      }
    }
  })

  socket.on('getMostFrequent', (data) => {
    io.to(data[0].side).emit("receiveMostFrequent", mostFrequentPropertyValues(data));
  })

  socket.on('voteMove', (data) => {
    io.to(data.side).emit("receiveVotes", data.mostFrequent)

    if (turn === "Black"){
     votes++
      if(votes === blackPlayers.length){
        io.to("Black").emit("receiveFinalVotes", { side: "Black" , mostFrequent: data.mostFrequent} );
      }
    }
    
    if(turn === "White"){
      votes++
      if(votes === whitePlayers.length){
        io.to("White").emit("receiveFinalVotes",{ side: "White" , mostFrequent: data.mostFrequent});
      }
    }
  })

  socket.on('sendFinalMove', data => {
    if (!sentOnce) {
      sentOnce = true
      io.emit("receiveFinalMove", data)
      handleTurnChange(io)
    }
  })

  socket.on('sendReset', () => {
    suggestedMoves = []
    votes = 0
    finalMove = null
    sentOnce = false

    io.emit('receiveReset')
  })

  // socket.on('disconnect', () => {
  //   if (queueLength > 0) {
  //     queueLength--;
  //     io.emit('updateQueue', queueLength)
  //     console.log('player disconnected');
  //   }
  // });
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
