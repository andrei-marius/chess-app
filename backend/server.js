import express from 'express';
import { createServer } from 'http';
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server);

let queueLength = 0;
let queueMax = 1;
let blackArr = [];
let whiteArr = [];
let finalArr = []
let whiteFinalMove = []
let blackFinalMove = []
let whitePlayers = []
let blackPlayers = []

function mostFrequentPropertyValues(array) {
  // Extract values of the specified property from the array of objects
  const propValues = array.map(obj => obj['move']);

  // Count the frequency of each property value
  const frequencyMap = propValues.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});

  // Find the highest frequency
  const maxFrequency = Math.max(...Object.values(frequencyMap));

  // Find the property values with the highest frequency
  const mostFrequentValues = Object.keys(frequencyMap)
    .filter(key => frequencyMap[key] === maxFrequency)
    .map(move => ({ move, numberOfVotes: 0 }));

  return mostFrequentValues;
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
array1.length === array2.length ? true : false;
}

  

  function determineWinner(team1, team2) {
    console.log('team 1', team1)
    console.log('team 2', team2)
    const moves = { rock: "scissors", paper: "rock", scissors: "paper" };
    const moves2 = { rock: "rock", paper: "paper", scissors: "scissors" };

    // if (team1.move || !(team2.move in moves2)) return "Invalid move!";
    
    if (team1.move === team2.move) return "It's a tie!";
    
    return moves[team1.move] === team2.move ? `${team1.side} with ${team1.move} won against ${team2.side} with ${team2.move}` 
    : `${team2.side} with ${team2.move} won against ${team1.side} with ${team1.move}`;
  }

io.on('connection', (socket) => {
  console.log(socket.id, 'connected')

  socket.on('restart', () => {
    queueLength = 0;
    blackArr = [];
    whiteArr = [];
    whiteFinalMove = []
    blackFinalMove = []
    io.emit('restartGame')
  })

  socket.on('joinQueue', () => {
    if (queueLength < queueMax) {
      queueLength++;
      io.emit('updateQueue', queueLength)
      console.log(socket.id, 'player joined');
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
    }
  });

  socket.on('cancelQueue', () => {
    if (queueLength > 0) {
      queueLength--;
      io.emit('updateQueue', queueLength)
      console.log(socket.id, 'player cancelled');
    }
  })

  socket.on('sendMove', (data) => {
    if (data.side === 'Black') {
      blackArr.push(data)
      
      io.to(data.side).emit("receiveMoves", data.side === 'White' ? whiteArr : blackArr)
      console.log(blackPlayers)
    }
    if (data.side === 'White') {
      whiteArr.push(data)
      
      io.to(data.side).emit("receiveMoves", data.side === 'White' ? whiteArr : blackArr)
      console.log(whitePlayers)
    }

    console.log(blackArr)
    console.log(whiteArr)
    ;
  })

  socket.on('getMostFrequent', (data) => {
    io.to(data).emit("receiveMostFrequent", data === 'White' ? mostFrequentPropertyValues(whiteArr) : mostFrequentPropertyValues(blackArr));
  })

  socket.on('voteMove', (data) => {
    io.to(data.side).emit("receiveVotes", data.mostFrequent);
  })

  socket.on('sendFinalMoves', data => {
    console.log('data side', data.side)

    if (whiteFinalMove.length < 1 || blackFinalMove.length < 1) {
      if (data.side === 'White' && whiteFinalMove.length < 1) {
        whiteFinalMove.push({ move: data.move, side: 'White'})
      } else {
        blackFinalMove.push({ move: data.move, side: 'Black'})
      }
    } else return console.log("how are you here?")

    console.log('black final', blackFinalMove)
    console.log('white final', whiteFinalMove)

    if (whiteFinalMove.length === 1 && blackFinalMove.length === 1) io.emit("receiveWinner", determineWinner(whiteFinalMove[0], blackFinalMove[0]));
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
