import { db, auth } from "../services.js";

//verifyToken endpoint
const verifyToken = async (req, res) => {
    const token = req.headers.authorization?.split('Bearer ')[1];
    try {
      const decodedToken = await auth.verifyIdToken(token);
      res.status(200).send(decodedToken);
    } catch (error) {
      res.status(401).send('Unauthorized');
    }
};
  
//signup endpoint
const signup = async (req, res) => {
    const { email, password, username } = req.body;

    if (username.trim().length === 0) {
        return res.status(400).json({ error: 'Missing username' });
    }

    try {
        const userRecord = await auth.createUser({
            email,
            password,
        });
        await db.collection('users').doc(userRecord.uid).set({
            username,
            email,
            password,
            createdAt: new Date(),
        });

        const token = await auth.createCustomToken(userRecord.uid);
        res.status(201).json({ token, message: 'User created successfully' });
    } catch (error) {
        res.status(400).json({ error: `Error creating user: ${error.message}` });
    }
};

//login endpoint
const login = async (req, res) => {
    const { email, password } = req.body;

    if (email.trim().length === 0) {
        return res.status(400).json({ error: 'Missing email' });
    }
    
    if (password.trim().length === 0) {
        return res.status(400).json({ error: 'Missing password' });
    }

    try {
        const userSnapshot = await db.collection('users').where('email', '==', email).get();

        if (!userSnapshot.empty) {
            // return res.status(400).json({ error: 'Wrong email' });
            const userDoc = userSnapshot.docs[0];
            const userDb = userDoc.data();

            if (password !== userDb.password) {
                return res.status(400).json({ error: 'Wrong password' });
            }
        }

        const user = await auth.getUserByEmail(email);
        const token = await auth.createCustomToken(user.uid);

        res.status(200).json({ token });
    } catch (error) {
        res.status(400).json({ error: `Error logging in: ${error.message}` });
    }
};

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

const addGameResult = async (req, res) => {
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
};

const leaderboard = async (req, res) => {
    try {
        const leaderboardSnapshot = await db.collection('leaderboard').orderBy('score', 'desc').get();
        const leaderboard = leaderboardSnapshot.docs.map(doc => doc.data());
        res.status(200).json(leaderboard);
    } catch (error) {
        res.status(500).json({ error: `Error fetching leaderboard: ${error.message}` });
    }
};

export {
    verifyToken,
    signup,
    login,
    authenticate,
    addGameResult,
    leaderboard,
}

