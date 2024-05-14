// socketHandlers.js
import { shuffleArray, mostFrequentPropertyValues, arrLengthCheck } from './utils.js';


let queueLength = 0;
let queueMax = 3;
let whitePlayers = [];
let blackPlayers = [];
let suggestedMoves = [];
let votes = 0;
let turn = 'White';
let sentOnce = false;

export const initSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log(`${socket.id} connected`);

    socket.emit('turnChange', turn);

    socket.on('joinQueue', () => {
      if (queueLength < queueMax) {
        queueLength++;
        io.emit('updateQueue', queueLength);
        if (queueLength === queueMax) {
          startGame(io);
        }
      }
    });

    socket.on('sendMove', (data) => {
      suggestedMoves.push(data);
      processMove(io, data);
    });

    socket.on('voteMove', (data) => {
      processVote(io, data);
    });

    socket.on('disconnect', () => {
      if (queueLength > 0) {
        queueLength--;
        io.emit('updateQueue', queueLength);
      }
    });

    // Additional handlers as necessary
  });
};

const startGame = (io) => {
  const players = shuffleArray([...io.sockets.sockets.values()]);
  const midpointIndex = Math.ceil(players.length / 2);
  whitePlayers = players.slice(0, midpointIndex);
  blackPlayers = players.slice(midpointIndex);

  whitePlayers.forEach(player => player.join('White'));
  blackPlayers.forEach(player => player.join('Black'));

  io.to('White').emit('assignTeam', 'White');
  io.to('Black').emit('assignTeam', 'Black');
};

const processMove = (io, data) => {
  if (arrLengthCheck([...whitePlayers, ...blackPlayers], suggestedMoves)) {
    const mostFrequent = mostFrequentPropertyValues(suggestedMoves);
    io.emit("receiveFinalMove", mostFrequent[0]);
    suggestedMoves = [];
    votes = 0;
  }
};

const processVote = (io, data) => {
  votes++;
  if (votes === (data.side === 'White' ? whitePlayers.length : blackPlayers.length)) {
    io.to(data.side).emit("finalVoteResult", data);
    suggestedMoves = [];
    votes = 0;
  }
};
