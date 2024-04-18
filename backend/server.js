import express from 'express';
import { createServer } from 'http';
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server);

let queueLength = 0;
const queueMax = 1;

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
        socket.join('White')
        player.emit('assignTeam', { player: player.id, side: 'White' });
      });

      blackPlayers.forEach((player) => {
        socket.join('Black')
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
    console.log(data)
    io.to(data.side).emit("receiveMoves", data.move);
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
