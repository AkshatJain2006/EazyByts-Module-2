import express from 'express';
import { getPortfolio, getBalance } from '../controllers/portfolioController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/portfolio - Get user's portfolio
router.get('/', authenticateToken, getPortfolio);

// GET /api/portfolio/balance - Get user's balance
router.get('/balance', authenticateToken, getBalance);

export default router;
