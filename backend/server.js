import express from 'express';
import { createServer } from 'http';
import { Server } from "socket.io";
import { initializeSocketHandlers } from './socketHandlers.js';
import { routes } from './routes/appRoutes.js';

const app = express();
const server = createServer(app);
const io = new Server(server);

//middleware to parse json bodies
app.use(express.json()); 

app.use('/api', routes)

initializeSocketHandlers(io);

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});