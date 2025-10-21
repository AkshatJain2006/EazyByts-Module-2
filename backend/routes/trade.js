import express from 'express';
import { buyStock, sellStock, getTransactionHistory } from '../controllers/tradeController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/trade/buy - Buy stock
router.post('/buy', authenticateToken, buyStock);

// POST /api/trade/sell - Sell stock
router.post('/sell', authenticateToken, sellStock);

// GET /api/trade/history - Get transaction history
router.get('/history', authenticateToken, getTransactionHistory);

export default router;
