import React, { useState, useEffect } from 'react';
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
  marketCap: string;
  pe: number;
  high52w: number;
  low52w: number;
}

const StockCharts: React.FC = () => {
  const [stocks, setStocks] = useState<string[]>([]);
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '1Y'>('1M');
  const [chartType, setChartType] = useState<'price' | 'volume'>('price');

  // Mock data for demonstration
  const mockStockData: { [key: string]: StockData } = {
    AAPL: {
      symbol: 'AAPL',
      prices: [165, 168, 172, 170, 175, 173, 178, 180, 175, 182, 185, 175.43],
      volumes: [45000000, 52000000, 38000000, 61000000, 48000000, 55000000, 42000000, 39000000, 58000000, 47000000, 51000000, 45234567],
      dates: ['Jan 1', 'Jan 8', 'Jan 15', 'Jan 22', 'Jan 29', 'Feb 5', 'Feb 12', 'Feb 19', 'Feb 26', 'Mar 5', 'Mar 12', 'Mar 19'],
      currentPrice: 175.43,
      change: 2.15,
      changePercent: 1.24,
      marketCap: '2.8T',
      pe: 28.5,
      high52w: 198.23,
      low52w: 124.17
    },
    GOOGL: {
      symbol: 'GOOGL',
      prices: [2800, 2850, 2900, 2875, 2920, 2890, 2940, 2910, 2880, 2860, 2870, 2847.52],
      volumes: [1200000, 1350000, 980000, 1450000, 1100000, 1280000, 1050000, 890000, 1380000, 1150000, 1220000, 1234567],
      dates: ['Jan 1', 'Jan 8', 'Jan 15', 'Jan 22', 'Jan 29', 'Feb 5', 'Feb 12', 'Feb 19', 'Feb 26', 'Mar 5', 'Mar 12', 'Mar 19'],
      currentPrice: 2847.52,
      change: -15.23,
      changePercent: -0.53,
      marketCap: '1.9T',
      pe: 24.8,
      high52w: 3030.93,
      low52w: 2193.62
    },
    MSFT: {
      symbol: 'MSFT',
      prices: [360, 365, 370, 368, 375, 372, 380, 378, 374, 376, 380, 378.85],
      volumes: [22000000, 25000000, 18000000, 28000000, 21000000, 24000000, 19000000, 17000000, 26000000, 20000000, 23000000, 23456789],
      dates: ['Jan 1', 'Jan 8', 'Jan 15', 'Jan 22', 'Jan 29', 'Feb 5', 'Feb 12', 'Feb 19', 'Feb 26', 'Mar 5', 'Mar 12', 'Mar 19'],
      currentPrice: 378.85,
      change: 5.67,
      changePercent: 1.52,
      marketCap: '2.8T',
      pe: 32.1,
      high52w: 384.30,
      low52w: 309.45
    }
  };

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        // Use mock data for now
        const stockSymbols = Object.keys(mockStockData);
        setStocks(stockSymbols);
        
        // Uncomment when backend is ready
        // const data = await getStocks();
        // setStocks(data.map((stock: any) => stock.symbol));
        // if (data.length > 0) {
        //   setSelectedStock(data[0].symbol);
        // }
      } catch (err: any) {
        setError('Failed to load stocks');
      }
    };

    fetchStocks();
  }, [mockStockData]);

  useEffect(() => {
    if (selectedStock) {
      const fetchStockData = async () => {
        setLoading(true);
        try {
          // Use mock data for now
          setStockData(mockStockData[selectedStock] || null);
          
          // Uncomment when backend is ready
          // const data = await getStockBySymbol(selectedStock);
          // setStockData(data);
        } catch (err: any) {
          setError('Failed to load stock data');
        } finally {
          setLoading(false);
        }
      };

      fetchStockData();
    }
  }, [selectedStock, timeframe, mockStockData]);

  const priceChartData = stockData ? {
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
  } : null;

  const volumeChartData = stockData ? {
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
  } : null;

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

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="glass-effect p-8 rounded-2xl">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white font-medium">Loading chart data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8 fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Stock Charts</h1>
          <p className="text-white/70">Technical analysis and price movements</p>
        </div>
      </div>

      {/* Controls */}
      <div className="glass-effect p-6 rounded-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stock Selection */}
          <div>
            <label className="block text-white/90 text-sm font-medium mb-2">Select Stock</label>
            <select
              value={selectedStock}
              onChange={(e) => setSelectedStock(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {stocks.map((stock) => (
                <option key={stock} value={stock} className="bg-gray-800">
                  {stock}
                </option>
              ))}
            </select>
          </div>

          {/* Timeframe Selection */}
          <div>
            <label className="block text-white/90 text-sm font-medium mb-2">Timeframe</label>
            <div className="flex space-x-2">
              {(['1D', '1W', '1M', '3M', '1Y'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setTimeframe(period)}
                  className={`px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                    timeframe === period
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/10 text-black hover:bg-white/20'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          {/* Chart Type Selection */}
          <div>
            <label className="block text-white/90 text-sm font-medium mb-2">Chart Type</label>
            <div className="flex space-x-2">
              <button
                onClick={() => setChartType('price')}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  chartType === 'price'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                Price
              </button>
              <button
                onClick={() => setChartType('volume')}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  chartType === 'volume'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                Volume
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="glass-effect p-6 rounded-2xl border border-red-500/30">
          <p className="text-red-100">{error}</p>
        </div>
      )}

      {stockData && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Stock Info */}
          <div className="glass-effect p-6 rounded-2xl">
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
                <span className="text-white/70">Market Cap</span>
                <span className="text-white font-medium">{stockData.marketCap}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">P/E Ratio</span>
                <span className="text-white font-medium">{stockData.pe.toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">52W High</span>
                <span className="text-white font-medium">${stockData.high52w.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">52W Low</span>
                <span className="text-white font-medium">${stockData.low52w.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="lg:col-span-3 glass-effect p-6 rounded-2xl">
            <h3 className="text-xl font-semibold text-white mb-6">
              {stockData.symbol} {chartType === 'price' ? 'Price Chart' : 'Volume Chart'}
            </h3>
            <div className="h-96">
              {chartType === 'price' && priceChartData && (
                <Line data={priceChartData} options={chartOptions} />
              )}
              {chartType === 'volume' && volumeChartData && (
                <Bar data={volumeChartData} options={chartOptions} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockCharts;
