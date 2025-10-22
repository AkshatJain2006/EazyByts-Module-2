import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const baseURL = process.env.STOCK_API_URL || 'https://api.finnhub.io/api/v1';
const apiKey = process.env.STOCK_API_KEY;

// Get live quote for a single symbol
export async function getStockQuote(symbol) {
  try {
    const response = await axios.get(`${baseURL}/quote`, {
      params: { symbol, token: apiKey }
    });
    return response.data;  // Finnhub returns object with 'c' (current price), 'h' (high), 'l' (low), etc.
  } catch (error) {
    console.error('Error fetching Finnhub quote:', error.message);
    throw new Error('Failed to fetch live stock data');
  }
}

// Fetch multiple stocks by calling getStockQuote in parallel
export async function getMultipleStocks(symbols = ['AAPL', 'GOOGL', 'TSLA']) {
  try {
    const promises = symbols.map(symbol => getStockQuote(symbol));
    const results = await Promise.all(promises);
    return results;
  } catch (error) {
    console.error('Error fetching multiple quotes:', error.message);
    throw new Error('Failed to fetch multiple stock prices');
  }
}
