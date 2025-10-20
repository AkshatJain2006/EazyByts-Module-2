import { getStockQuote, getMultipleStocks } from '../services/stockService.js';

// Get single stock quote
export const getStockData = async (req, res) => {
  try {
    const { symbol } = req.query;
    if (!symbol) {
      return res.status(400).json({ success: false, message: 'Stock symbol is required.' });
    }
    const data = await getStockQuote(symbol.toUpperCase());
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get multiple stocks list
export const getStocksList = async (req, res) => {
  try {
    const symbols = req.query.symbols ? req.query.symbols.split(',').map(s => s.trim()) : ['AAPL', 'GOOGL', 'TSLA'];
    const data = await getMultipleStocks(symbols);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
