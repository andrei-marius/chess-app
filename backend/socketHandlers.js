import {
  resetMoveAndSwitchTurn,
  shuffleArray,
  mostFrequentPropertyValues,
  arrLengthCheck, 
  resetCountdown
} from './utils.js';

let queueLength = 0;
const queueMax = 6
let whitePlayers = []
let blackPlayers = []
let suggestedMoves = []
let votes = 0
// let finalMove
let turn = 'white'
let playersReady = []
const countdownTimeStart = 10 // Countdown time in seconds, top var to be changed easily
let countdownTime = countdownTimeStart // to increment/decrement
let countdown // for interval
let playersJoined = []

export function initializeSocketHandlers(io) {
  io.on('connection', (socket) => {
    console.log(socket.id, 'connected')
  
    socket.on('joinQueue', () => {
      queueLength++;
      io.emit('updateQueue', queueLength)
      playersJoined.push(socket)
      console.log(socket.id, 'player joined');
  
      if (countdownTime === countdownTimeStart) {
        countdown = setInterval(() => {
          if (countdownTime > 0) {
            countdownTime--;
            io.emit('countdown', countdownTime);
          } 
  
          if (countdownTime === 0 || queueLength === queueMax) {
            if (queueLength > 1) {
              clearInterval(countdown);
              // const players = io.sockets.sockets.values();
              // const playerArray = Array.from(players);
          
              // Shuffle the player array randomly
              const shuffledPlayers = shuffleArray(playersJoined);
              
              // Randomly assign each player to a team
              shuffledPlayers.forEach(player => {
                if (Math.random() < 0.5) {
                  whitePlayers.push(player);
                } else {
                  blackPlayers.push(player);
                }
              });
          
              // Ensure teams are balanced by moving players if necessary
              while (whitePlayers.length > blackPlayers.length + 1) {
                const randomIndex = Math.floor(Math.random() * whitePlayers.length);
                blackPlayers.push(whitePlayers.splice(randomIndex, 1)[0]);
              }
              while (blackPlayers.length > whitePlayers.length + 1) {
                const randomIndex = Math.floor(Math.random() * blackPlayers.length);
                whitePlayers.push(blackPlayers.splice(randomIndex, 1)[0]);
              }
              
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
  
            if (queueLength === 1) {
                playersJoined[0].emit('notEnoughPlayers', 'Not enough players')
                resetCountdown()
                queueLength = 0
                playersJoined = []
            }
          }
        }, 1000)
      }
    })
  
    socket.on('cancelQueue', () => {
      if (queueLength > 0) {
        queueLength--;
        io.emit('updateQueue', queueLength)
        playersJoined = playersJoined.filter(player => player !== socket);
        console.log(socket.id, 'player cancelled');
      }
  
      if (queueLength === 0) {
        resetCountdown()
      }
    })
  
    socket.on('playerReady', (data) => {
      playersReady.push(data)
      console.log(playersReady)
      if (playersReady.length === blackPlayers.length + whitePlayers.length) {
        io.emit('playersReady')
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
          io.emit("receiveFinalMove", suggestedMoves[0], turn === 'white' ? 'black' : 'white'); // send turn also
          resetMoveAndSwitchTurn()
        }
        
        if (blackPlayers.length > 1) {
          io.to(turn).emit("receiveMoves", suggestedMoves)
  
          if (arrLengthCheck(blackPlayers, suggestedMoves)) {
            if (mostFrequentPropertyValues(suggestedMoves).length === 1) {
              io.emit("receiveFinalMove", suggestedMoves[0], turn === 'white' ? 'black' : 'white'); // send turn also
              resetMoveAndSwitchTurn()
            } else {
              io.to(turn).emit('allTeamMoved', suggestedMoves)
            }
          }
        }
      }
      
      if (turn === 'white') {
        if (whitePlayers.length === 1 && arrLengthCheck(whitePlayers, suggestedMoves)) {
          io.emit("receiveFinalMove", suggestedMoves[0], turn === 'white' ? 'black' : 'white'); // send turn also
          resetMoveAndSwitchTurn()
        }
        
        if (whitePlayers.length > 1) {
          io.to(turn).emit("receiveMoves", suggestedMoves, turn)
  
          if (arrLengthCheck(whitePlayers, suggestedMoves)) {
            if (mostFrequentPropertyValues(suggestedMoves).length === 1) {
              io.emit("receiveFinalMove", suggestedMoves[0], turn === 'white' ? 'black' : 'white'); // send turn also
              resetMoveAndSwitchTurn()
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
              io.emit("receiveFinalMove", maxVotesMove, turn === 'white' ? 'black' : 'white'); // send turn also
              resetMoveAndSwitchTurn();
          }
      }
  });
  
    // socket.on('disconnect', () => {
    //   if (queueLength > 0) {
    //     queueLength--;
    //     io.emit('updateQueue', queueLength)
    //     console.log('player disconnected');
    //   }
    // });
  });
}
  