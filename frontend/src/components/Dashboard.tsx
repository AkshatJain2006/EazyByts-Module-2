import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

interface Stock {
  symbol: string;
  price: number;
  change: number;
  volume?: number;
  marketCap?: string;
}

interface PortfolioSummary {
  totalValue: number;
  dayChange: number;
  dayChangePercent: number;
}

const Dashboard: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock Indian stocks data
  const mockStocks: Stock[] = [
    { symbol: 'RELIANCE', price: 2850.75, change: 45.20, volume: 8234567, marketCap: '15.2L Cr' },
    { symbol: 'TCS', price: 3650.20, change: -25.80, volume: 1534567, marketCap: '13.4L Cr' },
    { symbol: 'INFY', price: 1485.60, change: 18.45, volume: 4356789, marketCap: '6.2L Cr' },
    { symbol: 'HDFC', price: 1620.40, change: -12.30, volume: 2654321, marketCap: '8.9L Cr' },
    { symbol: 'ICICI', price: 950.85, change: 8.75, volume: 5456789, marketCap: '6.7L Cr' },
    { symbol: 'BHARTI', price: 875.30, change: 15.60, volume: 3234567, marketCap: '4.8L Cr' }
  ];

  const mockPortfolio: PortfolioSummary = {
    totalValue: 8542150.50,
    dayChange: 184732.50,
    dayChangePercent: 2.21
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use mock data for now
        setStocks(mockStocks);
        setPortfolio(mockPortfolio);
        
        // Uncomment when backend is ready
        // const stockData = await getStocks();
        // const portfolioData = await getPortfolio();
        // setStocks(stockData);
        // setPortfolio(portfolioData);
      } catch (err: any) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Set up Socket.io for real-time updates
    const socket = io('http://localhost:5000');
    socket.on('stockUpdate', (updatedStock: Stock) => {
      setStocks(prevStocks =>
        prevStocks.map(stock =>
          stock.symbol === updatedStock.symbol ? updatedStock : stock
        )
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [mockStocks, mockPortfolio]);

  const filteredStocks = stocks.filter(stock =>
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="modern-card p-8">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-white font-medium">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="modern-card p-6 bg-danger border border-red-500/30">
          <p className="text-red-100">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Welcome back! Here's your market overview.</p>
        </div>
        <div className="mt-4 lg:mt-0">
          <input
            type="text"
            placeholder="Search stocks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="modern-input w-full lg:w-80"
          />
        </div>
      </div>

      {/* Portfolio Summary */}
      {portfolio && (
        <div className="stats-grid">
          <div className="modern-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">Portfolio Value</p>
                <p className="text-3xl font-bold text-white">₹{portfolio.totalValue.toLocaleString()}</p>
              </div>

            </div>
          </div>
          
          <div className="modern-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">Day Change</p>
                <p className={`text-3xl font-bold ${portfolio.dayChange >= 0 ? 'text-success' : 'text-danger'}`}>
                  {portfolio.dayChange >= 0 ? '+' : ''}₹{portfolio.dayChange.toLocaleString()}
                </p>
              </div>

            </div>
          </div>
          
          <div className="modern-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">Day Change %</p>
                <p className={`text-3xl font-bold ${portfolio.dayChangePercent >= 0 ? 'text-success' : 'text-danger'}`}>
                  {portfolio.dayChangePercent >= 0 ? '+' : ''}{portfolio.dayChangePercent.toFixed(2)}%
                </p>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Market Overview */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Market Overview</h2>
        <div className="dashboard-grid">
          {filteredStocks.map((stock) => (
            <div key={stock.symbol} className="modern-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">

                  <div>
                    <h3 className="text-lg font-semibold text-white">{stock.symbol}</h3>
                    {stock.marketCap && (
                      <p className="text-gray-400 text-sm">{stock.marketCap}</p>
                    )}
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  stock.change >= 0 
                    ? 'bg-success text-success' 
                    : 'bg-danger text-danger'
                }`}>
                  {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Price</span>
                  <span className="text-2xl font-bold text-white">₹{stock.price.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Change %</span>
                  <span className={`font-semibold ${
                    stock.change >= 0 ? 'text-success' : 'text-danger'
                  }`}>
                    {((stock.change / (stock.price - stock.change)) * 100).toFixed(2)}%
                  </span>
                </div>
                
                {stock.volume && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Volume</span>
                    <span className="text-gray-300">{stock.volume.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
