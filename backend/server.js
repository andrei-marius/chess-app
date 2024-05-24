import express from 'express';
import { createServer } from 'http';
import { Server } from "socket.io";
import admin from 'firebase-admin';
import serviceAccount from './serviceAccountKey.json' assert { type: "json" };

import { initializeSocketHandlers } from './socketHandlers.js';

const app = express();
const server = createServer(app);
const io = new Server(server);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();
const auth = admin.auth();

//middleware to parse json bodies
app.use(express.json()); 

//verifyToken endpoint
app.post('/verifyToken', async (req, res) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  try {
    const decodedToken = await auth.verifyIdToken(token);
    res.status(200).send(decodedToken);
  } catch (error) {
    res.status(401).send('Unauthorized');
  }
});


//signup endpoint
app.post('/signup', async (req, res) => {
  const { email, password, username } = req.body;
  try {
    const userRecord = await auth.createUser({
      email,
      password,
    });
    await db.collection('users').doc(userRecord.uid).set({
      username,
      email,
      createdAt: new Date(),
    });
    const token = await auth.createCustomToken(userRecord.uid);
    res.status(201).json({ token, message: 'User created successfully' });
  } catch (error) {
    res.status(400).json({ error: `Error creating user: ${error.message}` });
  }
});


//login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await auth.getUserByEmail(email);
    const token = await auth.createCustomToken(user.uid);
    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ error: `Error logging in: ${error.message}` });
  }
});

//middleware to secure endpoints
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).send('Unauthorized');
  }
};

app.use(authenticate);

app.post('/addGameResult', authenticate, async (req, res) => {
  const { username, score } = req.body;
  try {
    await db.collection('leaderboard').add({
      username,
      score,
      date: new Date(),
    });
    res.status(200).json({ message: 'Game result added to leaderboard!' });
  } catch (error) {
    res.status(500).json({ error: `Error adding game result: ${error.message}` });
  }
});

app.get('/leaderboard', async (req, res) => {
  try {
    const leaderboardSnapshot = await db.collection('leaderboard').orderBy('score', 'desc').get();
    const leaderboard = leaderboardSnapshot.docs.map(doc => doc.data());
    res.status(200).json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: `Error fetching leaderboard: ${error.message}` });
  }
});



let queueLength = 0;
let queueMax = 3
let whitePlayers = []
let blackPlayers = []
let suggestedMoves = []
let votes = 0
let finalMove
let turn = 'white'
let playersReady = []
const countdownTimeStart = 10 // Countdown time in seconds, top var to be changed easily
let countdownTime = countdownTimeStart // to increment/decrement
let countdown // for interval
let playersJoined = []

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

function resetMoveAndSwitchTurn() {
  turn = turn === 'white' ? 'black' : 'white'
  suggestedMoves = []
  votes = 0
  finalMove = null

  io.emit('resetMove')
}

function resetCountdown() {
  clearInterval(countdown);
  countdownTime = countdownTimeStart;
  io.emit('countdown', countdownTime);
}

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

        if (countdownTime === 0) {
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
initializeSocketHandlers(io);

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});