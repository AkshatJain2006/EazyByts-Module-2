import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add JWT token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const signup = async (email: string, password: string, name: string) => {
  const response = await api.post('/auth/signup', { email, password, name });
  return response.data;
};

// Stocks API
export const getStocks = async () => {
  const response = await api.get('/stocks');
  return response.data;
};

export const getStockBySymbol = async (symbol: string) => {
  const response = await api.get(`/stocks/${symbol}`);
  return response.data;
};

// Portfolio API
export const getPortfolio = async () => {
  const response = await api.get('/portfolio');
  return response.data;
};

// Trade API
export const buyStock = async (symbol: string, quantity: number) => {
  const response = await api.post('/trade/buy', { symbol, quantity });
  return response.data;
};

export const sellStock = async (symbol: string, quantity: number) => {
  const response = await api.post('/trade/sell', { symbol, quantity });
  return response.data;
};

export const getTradeHistory = async () => {
  const response = await api.get('/trade/history');
  return response.data;
};

// Analytics API
export const getAnalytics = async () => {
  const response = await api.get('/analytics');
  return response.data;
};

export default api;
