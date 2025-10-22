import WebSocket from 'ws';
import { io } from '../server.js';
import dotenv from 'dotenv';

dotenv.config();

const finnhubSocketUrl = `wss://ws.finnhub.io?token=${process.env.STOCK_API_KEY}`;

const subscribedSymbols = ['AAPL', 'GOOGL', 'TSLA', 'MSFT', 'AMZN', 'NVDA'];

export function startFinnhubRealtime() {
  if (!process.env.STOCK_API_KEY || process.env.STOCK_API_KEY === 'your_stock_api_key_here') {
    console.log('Finnhub API key not configured. Real-time data disabled.');
    return;
  }

  const ws = new WebSocket(finnhubSocketUrl);

  ws.on('open', () => {
    console.log('Finnhub WebSocket connected');
    // Subscribe to symbols updates
    subscribedSymbols.forEach(symbol => {
      ws.send(JSON.stringify({ type: 'subscribe', symbol }));
    });
  });

  ws.on('message', (message) => {
    const parsed = JSON.parse(message);

    if (parsed.type === 'trade' && parsed.data?.length) {
      // Emit trade data to all connected Socket.IO clients
      io.emit('stockUpdate', parsed.data);
    }
  });

  ws.on('close', () => {
    console.log('Finnhub WebSocket disconnected');
  });

  ws.on('error', (error) => {
    console.error('Finnhub WebSocket error:', error);
    console.log('Note: Get a free API key from https://finnhub.io/register');
  });
}
