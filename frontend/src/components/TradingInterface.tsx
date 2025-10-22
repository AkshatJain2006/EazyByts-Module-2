import React, { useState, useEffect } from 'react';
import { useRealTimeStocks } from '../hooks/useRealTimeStocks';
import axios from 'axios';

interface Stock {
  symbol: string;
  price: number;
  change: number;
  volume?: number;
}

interface Trade {
  id: string;
  symbol: string;
  action: 'buy' | 'sell';
  quantity: number;
  price: number;
  timestamp: string;
  total: number;
}

const TradingInterface: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [selectedStock, setSelectedStock] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [action, setAction] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [limitPrice, setLimitPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [recentTrades, setRecentTrades] = useState<Trade[]>([]);
  const [balance, setBalance] = useState(0);

  const symbols = stocks.map(s => s.symbol);
  const { getPrice } = useRealTimeStocks(symbols);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to access trading');
          return;
        }

        // Fetch stocks
        const stocksResponse = await axios.get('http://localhost:5000/api/stocks/multiple?symbols=AAPL,GOOGL,MSFT,TSLA,AMZN,NVDA');
        
        // Transform Finnhub data to expected format
        const symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'NVDA'];
        const transformedStocks = stocksResponse.data.data.map((stock: any, index: number) => ({
          symbol: symbols[index],
          price: stock.c,
          change: stock.d,
          volume: Math.floor(Math.random() * 50000000)
        }));
        
        setStocks(transformedStocks);

        // Fetch portfolio for balance
        const portfolioResponse = await axios.get('http://localhost:5000/api/portfolio', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBalance(portfolioResponse.data.balance);

        // Fetch recent trades
        const tradesResponse = await axios.get('http://localhost:5000/api/trade/history', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRecentTrades(tradesResponse.data.slice(0, 5));
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load data');
      }
    };

    fetchData();
  }, []);

  const handleTrade = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    const selectedStockData = stocks.find(stock => stock.symbol === selectedStock);
    if (!selectedStockData) {
      setError('Please select a valid stock');
      setLoading(false);
      return;
    }

    const tradePrice = orderType === 'market' ? selectedStockData.price : parseFloat(limitPrice);
    const totalCost = tradePrice * quantity;



    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to trade');
        setLoading(false);
        return;
      }

      const response = await axios.post('http://localhost:5000/api/trade/buy', {
        symbol: selectedStock,
        quantity,
        price: tradePrice
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess(`Successfully ${action === 'buy' ? 'bought' : 'sold'} ${quantity} shares of ${selectedStock} for $${totalCost.toFixed(2)}`);
      
      // Refresh data
      const portfolioResponse = await axios.get('http://localhost:5000/api/portfolio', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBalance(portfolioResponse.data.balance);

      const tradesResponse = await axios.get('http://localhost:5000/api/trade/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecentTrades(tradesResponse.data.slice(0, 5));
      
      setQuantity(1);
      setLimitPrice('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Trade failed');
    } finally {
      setLoading(false);
    }
  };

  const selectedStockData = stocks.find(stock => stock.symbol === selectedStock);
  const realTimeData = getPrice(selectedStock);
  const currentPrice = selectedStockData ? (realTimeData?.price || selectedStockData.price) : 0;
  const totalCost = orderType === 'market' ? currentPrice * quantity : (parseFloat(limitPrice) || 0) * quantity;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 fade-in">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Trading Interface</h1>
        <p className="text-gray-400">Execute trades and manage your positions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trading Form */}
        <div className="lg:col-span-2">
          <div className="modern-card p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Place Order</h2>
              <div className="text-right">
                <p className="text-white/70 text-sm">Available Balance</p>
                <p className="text-2xl font-bold text-green-400">${balance.toLocaleString()}</p>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-100 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-500/20 border border-green-500/30 text-green-100 px-4 py-3 rounded-lg mb-6">
                {success}
              </div>
            )}

            <form onSubmit={handleTrade} className="space-y-6">
              {/* Stock Selection */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Stock Symbol</label>
                <select
                  value={selectedStock}
                  onChange={(e) => setSelectedStock(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  style={{ color: 'white', backgroundColor: '#1f2937' }}
                >
                  <option value="" style={{ backgroundColor: '#1f2937', color: 'white' }}>Select a stock</option>
                  {stocks.map((stock) => (
                    <option key={stock.symbol} value={stock.symbol} style={{ backgroundColor: '#1f2937', color: 'white' }}>
                      {stock.symbol} - ${(getPrice(stock.symbol)?.price || stock.price).toFixed(2)} ({stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Selection */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-3">Action</label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setAction('buy')}
                    className={`btn-success px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                      action === 'buy' ? 'opacity-100' : 'opacity-50'
                    }`}
                  >
                    Buy
                  </button>
                  <button
                    type="button"
                    onClick={() => setAction('sell')}
                    className={`btn-danger px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                      action === 'sell' ? 'opacity-100' : 'opacity-50'
                    }`}
                  >
                    Sell
                  </button>
                </div>
              </div>

              {/* Order Type */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-3">Order Type</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setOrderType('market')}
                    className={`p-4 rounded-2xl border-2 transition-all duration-300 font-semibold text-sm shadow-lg hover:shadow-xl transform hover:scale-105 ${
                      orderType === 'market'
                        ? 'order-type-market shadow-blue-500/25'
                        : 'order-type-inactive'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-1">
                      <span>Market Order</span>
                      <span className="text-xs opacity-75">Instant execution</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType('limit')}
                    className={`p-4 rounded-2xl border-2 transition-all duration-300 font-semibold text-sm shadow-lg hover:shadow-xl transform hover:scale-105 ${
                      orderType === 'limit'
                        ? 'order-type-limit shadow-orange-500/25'
                        : 'order-type-inactive'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-1">
                      <span>Limit Order</span>
                      <span className="text-xs opacity-75">Set your price</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Quantity and Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Quantity</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    min="1"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter quantity"
                    style={{ color: 'white', backgroundColor: '#1f2937' }}
                    required
                  />
                </div>
                
                {orderType === 'limit' && (
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Limit Price</label>
                    <input
                      type="number"
                      step="0.01"
                      value={limitPrice}
                      onChange={(e) => setLimitPrice(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter limit price"
                      style={{ color: 'white', backgroundColor: '#1f2937' }}
                      required
                    />
                  </div>
                )}
              </div>

              {/* Order Summary */}
              {selectedStockData && (
                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                  <h3 className="text-white font-medium mb-3">Order Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/70">Stock:</span>
                      <span className="text-white">{selectedStock}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Current Price:</span>
                      <span className="text-white">${currentPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Quantity:</span>
                      <span className="text-white">{quantity} shares</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Order Type:</span>
                      <span className="text-white capitalize">{orderType}</span>
                    </div>
                    {orderType === 'limit' && limitPrice && (
                      <div className="flex justify-between">
                        <span className="text-white/70">Limit Price:</span>
                        <span className="text-white">${parseFloat(limitPrice).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-white/10 pt-2 mt-2">
                      <span className="text-white/70 font-medium">Total Cost:</span>
                      <span className="text-white font-bold">${totalCost.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className={`w-full py-4 rounded-xl font-bold text-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border-2 ${
                  action === 'buy'
                    ? 'bg-green-600 hover:bg-green-700 border-green-500 shadow-lg hover:shadow-xl'
                    : 'bg-red-600 hover:bg-red-700 border-red-500 shadow-lg hover:shadow-xl'
                }`}
                style={{ color: '#ffffff', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
                disabled={loading || !selectedStock || (orderType === 'limit' && !limitPrice)}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2" style={{ color: '#ffffff' }}>
                    <div className="loading-spinner"></div>
                    <span style={{ color: '#ffffff', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>Processing...</span>
                  </div>
                ) : (
                  <span style={{ color: '#ffffff', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                    {`${action === 'buy' ? 'Buy' : 'Sell'} ${quantity} Shares`}
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Recent Trades */}
        <div className="modern-card p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Recent Trades</h3>
          <div className="space-y-4">
            {recentTrades.map((trade) => (
              <div key={trade.id} className="bg-white/5 p-4 rounded-lg border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">{trade.symbol}</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    trade.action === 'buy' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {trade.action.toUpperCase()}
                  </span>
                </div>
                <div className="text-sm text-white/70 space-y-1">
                  <div className="flex justify-between">
                    <span>Quantity:</span>
                    <span>{trade.quantity} shares</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price:</span>
                    <span>${trade.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total:</span>
                    <span>${trade.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time:</span>
                    <span>{new Date(trade.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingInterface;
