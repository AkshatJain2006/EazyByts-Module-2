import React, { useState } from 'react';

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
  const [sortBy, setSortBy] = useState<'value' | 'gainLoss' | 'symbol'>('value');

  // Mock portfolio data
  const mockHoldings: Holding[] = [
    {
      symbol: 'AAPL',
      quantity: 10,
      averagePrice: 150.00,
      currentPrice: 175.43,
      totalValue: 1754.30,
      gainLoss: 254.30,
      gainLossPercent: 16.95
    },
    {
      symbol: 'GOOGL',
      quantity: 5,
      averagePrice: 140.00,
      currentPrice: 147.52,
      totalValue: 737.60,
      gainLoss: 37.60,
      gainLossPercent: 5.37
    },
    {
      symbol: 'MSFT',
      quantity: 8,
      averagePrice: 350.00,
      currentPrice: 378.85,
      totalValue: 3030.80,
      gainLoss: 230.80,
      gainLossPercent: 8.24
    }
  ];

  const balance = 5000;
  const totalValue = mockHoldings.reduce((sum, holding) => sum + holding.totalValue, 0) + balance;
  const totalGainLoss = mockHoldings.reduce((sum, holding) => sum + holding.gainLoss, 0);

  const sortedHoldings = [...mockHoldings].sort((a, b) => {
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

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Portfolio</h1>
          <p className="text-gray-400">Track your investments and performance</p>
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'value' | 'gainLoss' | 'symbol')}
          className="px-4 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white"
        >
          <option value="value" className="bg-gray-800">Sort by Value</option>
          <option value="gainLoss" className="bg-gray-800">Sort by Gain/Loss</option>
          <option value="symbol" className="bg-gray-800">Sort by Symbol</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white bg-opacity-10 backdrop-blur-lg p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-gray-400 text-sm font-medium mb-1">Total Portfolio Value</p>
              <p className="text-3xl font-bold text-white">${totalValue.toLocaleString()}</p>
              <p className="text-sm text-gray-400 mt-1">Cash: ${balance.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white bg-opacity-10 backdrop-blur-lg p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-gray-400 text-sm font-medium mb-1">Total Gain/Loss</p>
              <p className={`text-3xl font-bold ${totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {totalGainLoss >= 0 ? '+' : ''}${totalGainLoss.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white bg-opacity-10 backdrop-blur-lg p-6 rounded-2xl">
        <h3 className="text-xl font-semibold text-white mb-6">Holdings</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white border-opacity-10">
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
                <tr key={holding.symbol} className="border-b border-white border-opacity-5 hover:bg-white hover:bg-opacity-5 transition-colors">
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
                    <div className={`font-medium ${holding.gainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {holding.gainLoss >= 0 ? '+' : ''}${holding.gainLoss.toFixed(2)}
                    </div>
                    <div className={`text-sm ${holding.gainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
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