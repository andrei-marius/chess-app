import {
    queueLength,
    queueMax,
    whitePlayers,
    blackPlayers,
    suggestedMoves,
    votes,
    turn,
    playersReady,
    resetAndSwitchTurns,
    shuffleArray,
    mostFrequentPropertyValues,
    arrLengthCheck
  } from './utils.js';

  let queueLength = 0;
  let votes = 0;
  let turn = 'white';
  
  export function initializeSocketHandlers(io) {
    io.on('connection', (socket) => {
      console.log(socket.id, 'connected');
  
      socket.on('joinQueue', () => {
        if (queueLength < queueMax) {
          queueLength++;
          io.emit('updateQueue', queueLength);
        }
  
        if (queueLength === queueMax) {
          const players = io.sockets.sockets.values();
          const playerArray = Array.from(players);
          const shuffledPlayers = shuffleArray(playerArray);
          const midpointIndex = Math.ceil(playerArray.length / 2);
  
          whitePlayers.splice(0, whitePlayers.length, ...shuffledPlayers.slice(0, midpointIndex));
          blackPlayers.splice(0, blackPlayers.length, ...shuffledPlayers.slice(midpointIndex));
  
          whitePlayers.forEach((player) => {
            player.join('white');
            player.emit('receiveAssignTeams', 'white');
          });
  
          blackPlayers.forEach((player) => {
            player.join('black');
            player.emit('receiveAssignTeams', 'black');
          });
  
          console.log('white team', whitePlayers.length);
          console.log('black team', blackPlayers.length);
        }
      });
  
      socket.on('cancelQueue', () => {
        if (queueLength > 0) {
          queueLength--;
          io.emit('updateQueue', queueLength);
        }
      });
  
      socket.on('playerReady', (data) => {
        playersReady.push(data);
        console.log(playersReady);
        if (playersReady.length === blackPlayers.length + whitePlayers.length) {
          io.emit('playersReady');
        }
      });
  
      socket.on('sendMove', (data) => {
        suggestedMoves.push(data);
  
        if (turn === 'black') {
          if (blackPlayers.length === 1 && arrLengthCheck(blackPlayers, suggestedMoves)) {
            io.emit("receiveFinalMove", suggestedMoves[0]);
            resetAndSwitchTurns(io);
          } else if (blackPlayers.length > 1) {
            io.to(turn).emit("receiveMoves", suggestedMoves);
  
            if (arrLengthCheck(blackPlayers, suggestedMoves)) {
              const frequentMoves = mostFrequentPropertyValues(suggestedMoves);
              if (frequentMoves.length === 1) {
                io.emit("receiveFinalMove", suggestedMoves[0]);
                resetAndSwitchTurns(io);
              } else {
                io.to(turn).emit('allTeamMoved', suggestedMoves);
              }
            }
          }
        }
  
        if (turn === 'white') {
          if (whitePlayers.length === 1 && arrLengthCheck(whitePlayers, suggestedMoves)) {
            io.emit("receiveFinalMove", suggestedMoves[0]);
            resetAndSwitchTurns(io);
          } else if (whitePlayers.length > 1) {
            io.to(turn).emit("receiveMoves", suggestedMoves, turn);
  
            if (arrLengthCheck(whitePlayers, suggestedMoves)) {
              const frequentMoves = mostFrequentPropertyValues(suggestedMoves);
              if (frequentMoves.length === 1) {
                io.emit("receiveFinalMove", suggestedMoves[0]);
                resetAndSwitchTurns(io);
              } else {
                io.to(turn).emit('allTeamMoved', suggestedMoves);
              }
            }
          }
        }
      });
  
      socket.on('getMostFrequent', (data) => {
        io.to(turn).emit("receiveMostFrequent", mostFrequentPropertyValues(data));
      });
  
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
            resetAndSwitchTurns(io);
          }
        }
      });
  
      socket.on('disconnect', () => {
        if (queueLength > 0) {
          queueLength--;
          io.emit('updateQueue', queueLength);
          console.log('player disconnected');
        }
      });
    });
  }
  