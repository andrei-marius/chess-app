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

initializeSocketHandlers(io);

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});