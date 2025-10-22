import React, { useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface StockData {
  symbol: string;
  prices: number[];
  volumes: number[];
  dates: string[];
  currentPrice: number;
  change: number;
  changePercent: number;
}

const StockCharts: React.FC = () => {
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '1Y'>('1M');
  const [chartType, setChartType] = useState<'price' | 'volume'>('price');

  const mockStockData: { [key: string]: StockData } = {
    AAPL: {
      symbol: 'AAPL',
      prices: [165, 168, 172, 170, 175, 173, 178, 180, 175, 182, 185, 175.43],
      volumes: [45000000, 52000000, 38000000, 61000000, 48000000, 55000000, 42000000, 39000000, 58000000, 47000000, 51000000, 45234567],
      dates: ['Jan 1', 'Jan 8', 'Jan 15', 'Jan 22', 'Jan 29', 'Feb 5', 'Feb 12', 'Feb 19', 'Feb 26', 'Mar 5', 'Mar 12', 'Mar 19'],
      currentPrice: 175.43,
      change: 2.15,
      changePercent: 1.24
    },
    GOOGL: {
      symbol: 'GOOGL',
      prices: [140, 142, 145, 143, 147, 144, 149, 146, 144, 143, 145, 147.52],
      volumes: [1200000, 1350000, 980000, 1450000, 1100000, 1280000, 1050000, 890000, 1380000, 1150000, 1220000, 1234567],
      dates: ['Jan 1', 'Jan 8', 'Jan 15', 'Jan 22', 'Jan 29', 'Feb 5', 'Feb 12', 'Feb 19', 'Feb 26', 'Mar 5', 'Mar 12', 'Mar 19'],
      currentPrice: 147.52,
      change: -1.23,
      changePercent: -0.83
    },
    MSFT: {
      symbol: 'MSFT',
      prices: [360, 365, 370, 368, 375, 372, 380, 378, 374, 376, 380, 378.85],
      volumes: [22000000, 25000000, 18000000, 28000000, 21000000, 24000000, 19000000, 17000000, 26000000, 20000000, 23000000, 23456789],
      dates: ['Jan 1', 'Jan 8', 'Jan 15', 'Jan 22', 'Jan 29', 'Feb 5', 'Feb 12', 'Feb 19', 'Feb 26', 'Mar 5', 'Mar 12', 'Mar 19'],
      currentPrice: 378.85,
      change: 5.67,
      changePercent: 1.52
    }
  };

  const stocks = Object.keys(mockStockData);
  const stockData = mockStockData[selectedStock];

  const priceChartData = {
    labels: stockData.dates,
    datasets: [
      {
        label: `${stockData.symbol} Price`,
        data: stockData.prices,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const volumeChartData = {
    labels: stockData.dates,
    datasets: [
      {
        label: `${stockData.symbol} Volume`,
        data: stockData.volumes,
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
        borderColor: '#8B5CF6',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: 'white',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      y: {
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Stock Charts</h1>
          <p className="text-white opacity-70">Technical analysis and price movements</p>
        </div>
      </div>

      <div className="bg-white bg-opacity-10 backdrop-blur-lg p-6 rounded-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-white text-sm font-medium mb-2">Select Stock</label>
            <select
              value={selectedStock}
              onChange={(e) => setSelectedStock(e.target.value)}
              className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {stocks.map((stock) => (
                <option key={stock} value={stock} className="bg-gray-800 text-white">
                  {stock}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-3">Timeframe</label>
            <div className="grid grid-cols-5 gap-3">
              {(['1D', '1W', '1M', '3M', '1Y'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setTimeframe(period)}
                  style={{
                    backgroundColor: timeframe === period ? '#4f46e5' : '#374151',
                    borderColor: timeframe === period ? '#4338ca' : '#4b5563',
                    color: '#ffffff',
                    borderWidth: '2px',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-3">Chart Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setChartType('price')}
                style={{
                  backgroundColor: chartType === 'price' ? '#059669' : '#374151',
                  borderColor: chartType === 'price' ? '#047857' : '#4b5563',
                  color: '#ffffff',
                  borderWidth: '2px',
                  padding: '16px',
                  borderRadius: '16px',
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <span style={{ color: '#ffffff' }}>Price Chart</span>
                  <span style={{ color: '#ffffff', fontSize: '12px', opacity: 0.75 }}>Line graph</span>
                </div>
              </button>
              <button
                onClick={() => setChartType('volume')}
                style={{
                  backgroundColor: chartType === 'volume' ? '#d97706' : '#374151',
                  borderColor: chartType === 'volume' ? '#b45309' : '#4b5563',
                  color: '#ffffff',
                  borderWidth: '2px',
                  padding: '16px',
                  borderRadius: '16px',
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <span style={{ color: '#ffffff' }}>Volume Chart</span>
                  <span style={{ color: '#ffffff', fontSize: '12px', opacity: 0.75 }}>Bar graph</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="bg-white bg-opacity-10 backdrop-blur-lg p-6 rounded-2xl">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">{stockData.symbol.charAt(0)}</span>
            </div>
            <h2 className="text-2xl font-bold text-white">{stockData.symbol}</h2>
            <p className="text-3xl font-bold text-white mt-2">${stockData.currentPrice.toFixed(2)}</p>
            <p className={`text-lg font-medium ${
              stockData.change >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {stockData.change >= 0 ? '+' : ''}${stockData.change.toFixed(2)} ({stockData.changePercent >= 0 ? '+' : ''}{stockData.changePercent.toFixed(2)}%)
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-white opacity-70">Timeframe</span>
              <span className="text-white font-medium">{timeframe}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white opacity-70">Data Points</span>
              <span className="text-white font-medium">{stockData.prices.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white opacity-70">High</span>
              <span className="text-white font-medium">${Math.max(...stockData.prices).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white opacity-70">Low</span>
              <span className="text-white font-medium">${Math.min(...stockData.prices).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 bg-white bg-opacity-10 backdrop-blur-lg p-6 rounded-2xl">
          <h3 className="text-xl font-semibold text-white mb-6">
            {stockData.symbol} {chartType === 'price' ? 'Price Chart' : 'Volume Chart'}
          </h3>
          <div className="h-96">
            {chartType === 'price' && (
              <Line data={priceChartData} options={chartOptions} />
            )}
            {chartType === 'volume' && (
              <Bar data={volumeChartData} options={chartOptions} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockCharts;