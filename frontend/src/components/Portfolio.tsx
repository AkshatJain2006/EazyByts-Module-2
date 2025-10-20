import React, { useState, useEffect } from 'react';
import { mockTradingStore } from '../utils/mockTradingStore';

interface Holding {
  symbol: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  totalValue: number;
  gainLoss: number;
  gainLossPercent: number;
}

const Portfolio: React.FC = () => {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [totalGainLoss, setTotalGainLoss] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState<'value' | 'gainLoss' | 'symbol'>('value');

  const mockStocks: { [key: string]: number } = {
    'RELIANCE': 2850.75,
    'TCS': 3650.20,
    'INFY': 1485.60,
    'HDFC': 1620.40,
    'ICICI': 950.85,
    'BHARTI': 875.30,
    'ITC': 425.15,
    'SBIN': 580.90,
    'HIND_UNILEVER': 2420.65,
    'BAJAJ_FINANCE': 6850.40
  };

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const storeHoldings = mockTradingStore.getHoldings();
        const portfolioHoldings: Holding[] = storeHoldings.map(h => {
          const currentPrice = mockStocks[h.symbol] || h.averagePrice;
          const totalValue = h.quantity * currentPrice;
          const gainLoss = totalValue - (h.quantity * h.averagePrice);
          const gainLossPercent = ((currentPrice - h.averagePrice) / h.averagePrice) * 100;
          
          return {
            symbol: h.symbol,
            quantity: h.quantity,
            averagePrice: h.averagePrice,
            currentPrice,
            totalValue,
            gainLoss,
            gainLossPercent
          };
        });
        
        setHoldings(portfolioHoldings);
        const total = portfolioHoldings.reduce((sum, holding) => sum + holding.totalValue, 0);
        const totalGain = portfolioHoldings.reduce((sum, holding) => sum + holding.gainLoss, 0);
        setTotalValue(total);
        setTotalGainLoss(totalGain);
      } catch (err: any) {
        setError('Failed to load portfolio');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [mockStocks]);

  const sortedHoldings = [...holdings].sort((a, b) => {
    switch (sortBy) {
      case 'value':
        return b.totalValue - a.totalValue;
      case 'gainLoss':
        return b.gainLoss - a.gainLoss;
      case 'symbol':
        return a.symbol.localeCompare(b.symbol);
      default:
        return 0;
    }
  });



  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="modern-card p-8">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-white font-medium">Loading portfolio...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="modern-card p-6 bg-danger">
          <p className="text-red-100">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Portfolio</h1>
          <p className="text-gray-400">Track your investments and performance</p>
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'value' | 'gainLoss' | 'symbol')}
          className="modern-input"
        >
          <option value="value">Sort by Value</option>
          <option value="gainLoss">Sort by Gain/Loss</option>
          <option value="symbol">Sort by Symbol</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="stats-grid">
        <div className="modern-card p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-gray-400 text-sm font-medium mb-1">Total Value</p>
              <p className="text-3xl font-bold text-white">${totalValue.toLocaleString()}</p>
            </div>

          </div>
        </div>
        
        <div className="modern-card p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-gray-400 text-sm font-medium mb-1">Total Gain/Loss</p>
              <p className={`text-3xl font-bold ${totalGainLoss >= 0 ? 'text-success' : 'text-danger'}`}>
                {totalGainLoss >= 0 ? '+' : ''}${totalGainLoss.toLocaleString()}
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="modern-card p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Holdings</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Stock</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Shares</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Avg Price</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Current Price</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Total Value</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Gain/Loss</th>
              </tr>
            </thead>
            <tbody>
              {sortedHoldings.map((holding) => (
                <tr key={holding.symbol} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{holding.symbol.charAt(0)}</span>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">{holding.symbol}</h4>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-left text-white font-medium">
                    {holding.quantity}
                  </td>
                  <td className="py-4 px-6 text-left text-white font-medium">
                    ${holding.averagePrice.toFixed(2)}
                  </td>
                  <td className="py-4 px-6 text-left text-white font-medium">
                    ${holding.currentPrice.toFixed(2)}
                  </td>
                  <td className="py-4 px-6 text-left text-white font-medium">
                    ${holding.totalValue.toLocaleString()}
                  </td>
                  <td className="py-4 px-6 text-left">
                    <div className={`font-medium ${holding.gainLoss >= 0 ? 'text-success' : 'text-danger'}`}>
                      {holding.gainLoss >= 0 ? '+' : ''}${holding.gainLoss.toFixed(2)}
                    </div>
                    <div className={`text-sm ${holding.gainLoss >= 0 ? 'text-success' : 'text-danger'}`}>
                      ({holding.gainLossPercent >= 0 ? '+' : ''}{holding.gainLossPercent.toFixed(2)}%)
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
