import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

// Add JWT token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const signup = async (name: string, email: string, password: string) => {
  const response = await api.post('/auth/signup', { name, email, password });
  return response.data;
};

// Stocks API - Updated to match backend routes
export const getStocks = async (symbols?: string[]) => {
  const symbolsParam = symbols ? symbols.join(',') : 'AAPL,GOOGL,TSLA,MSFT,AMZN';
  const response = await api.get(`/stocks/multiple?symbols=${symbolsParam}`);
  return response.data;
};

export const getStockBySymbol = async (symbol: string) => {
  const response = await api.get(`/stocks/live?symbol=${symbol}`);
  return response.data;
};

// Portfolio API
export const getPortfolio = async () => {
  const response = await api.get('/portfolio');
  return response.data;
};

export const getBalance = async () => {
  const response = await api.get('/portfolio/balance');
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

// Analytics API - Mock implementation for now
export const getAnalytics = async () => {
  // TODO: Implement when backend route is ready
  // For now, return mock data or use portfolio data
  throw new Error('Analytics API not yet implemented');
};

export default api;
