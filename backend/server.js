import express from 'express';
import { createServer } from 'http';
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server);

let queueLength = 0;
const queueMax = 3;
let blackArr = [];
let whiteArr = [];

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
  const mostFrequentValues = Object.keys(frequencyMap).filter(key => frequencyMap[key] === maxFrequency);

  return mostFrequentValues;
}


io.on('connection', (socket) => {
  console.log(socket.id, 'connected')

  socket.on('joinQueue', () => {
    if (queueLength < queueMax) {
      queueLength++;
      io.emit('updateQueue', queueLength)
      console.log(socket.id, 'player joined');
    }

    if (queueLength === queueMax) {
      const players = io.sockets.sockets.values();
      const playerArray = Array.from(players);
      const whitePlayers = playerArray.slice(0, queueMax / 2);
      const blackPlayers = playerArray.slice(queueMax / 2);

      
      whitePlayers.forEach((player) => {
        player.join('White')
        player.emit('assignTeam', { player: player.id, side: 'White' });
      });

      blackPlayers.forEach((player) => {
        player.join('Black')
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
    }
    if (data.side === 'White') {
      whiteArr.push(data)
    }

    console.log(blackArr)
    console.log(whiteArr)
    io.to(data.side).emit("receiveMoves", data.side === 'White' ? whiteArr : blackArr);
  })

  socket.on('getMostFrequent', (data) => {
    io.to(data).emit("receiveMostFrequent", data === 'White' ? mostFrequentPropertyValues(whiteArr) : mostFrequentPropertyValues(blackArr));
  })

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
