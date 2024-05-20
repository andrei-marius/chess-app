import express from 'express';
import { createServer } from 'http';
import { Server } from "socket.io";
import { initializeSocketHandlers } from './socketHandlers.js';

const app = express();
const server = createServer(app);
const io = new Server(server);

initializeSocketHandlers(io);

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
