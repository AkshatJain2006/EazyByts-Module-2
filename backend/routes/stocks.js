import express from 'express';
import { getStockData, getStocksList } from '../controllers/stockController.js';

const router = express.Router();

// GET /api/stocks/live?symbol=AAPL
router.get('/live', getStockData);

// GET /api/stocks/multiple?symbols=AAPL,TSLA,MSFT
router.get('/multiple', getStocksList);

export default router;
