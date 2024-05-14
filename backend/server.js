// server.js
import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { initSocketHandlers } from './socketHandlers.js';


const app = express();
const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*", // Configure appropriately for your environment
    methods: ["GET", "POST"]
  }
});

// Initialize socket handlers
initSocketHandlers(io);

// Add a basic route
app.get('/', (req, res) => {
  res.send('Chess Game Server is running');
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
