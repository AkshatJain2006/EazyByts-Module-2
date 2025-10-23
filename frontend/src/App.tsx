import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Portfolio from './components/Portfolio';
import TradingInterface from './components/TradingInterface';
import Analytics from './components/Analytics';
import StockCharts from './components/StockCharts';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

const Navbar: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const location = useLocation();
  
  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/portfolio', label: 'Portfolio' },
    { path: '/trading', label: 'Trading' },
    { path: '/analytics', label: 'Analytics' },
    { path: '/charts', label: 'Charts' }
  ];

  return (
    <nav className="navbar sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/dashboard" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <h1 className="text-white text-xl font-semibold">StockExchange</h1>
          </Link>
          
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                replace
                className={`px-4 py-2 rounded-xl transition-all duration-200 flex items-center space-x-2 ${
                  location.pathname === item.path
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
          
          <button
            onClick={onLogout}
            className="btn-danger text-white px-4 py-2 rounded-xl flex items-center space-x-2"
          >
            <span></span>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="modern-card p-8">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-white font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen">
        {isAuthenticated && <Navbar onLogout={handleLogout} />}
        <Routes key={window.location.pathname}>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<ProtectedRoute><ErrorBoundary key="dashboard"><Dashboard /></ErrorBoundary></ProtectedRoute>} />
          <Route path="/portfolio" element={<ProtectedRoute><ErrorBoundary key="portfolio"><Portfolio /></ErrorBoundary></ProtectedRoute>} />
          <Route path="/trading" element={<ProtectedRoute><ErrorBoundary key="trading"><TradingInterface /></ErrorBoundary></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><ErrorBoundary key="analytics"><Analytics /></ErrorBoundary></ProtectedRoute>} />
          <Route path="/charts" element={<ProtectedRoute><ErrorBoundary key="charts"><StockCharts /></ErrorBoundary></ProtectedRoute>} />
          <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;