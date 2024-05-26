import express from 'express';
import { verifyToken, signup, login, authenticate, addGameResult, leaderboard } from '../controllers/appController.js'

const router = express.Router()

router.post('/verifyToken', verifyToken)
router.post('/signup', signup)
router.post('/login', login)
router.post('/addGameResult', authenticate, addGameResult)
router.get('/leaderboard', leaderboard)

export { router as routes }