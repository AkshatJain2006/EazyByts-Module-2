import React, { useState, useEffect } from 'react';
import { mockTradingStore } from '../utils/mockTradingStore';

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
  const [balance, setBalance] = useState(mockTradingStore.getBalance());

  // Mock Indian stocks data
  const mockStocks: Stock[] = [
    { symbol: 'RELIANCE', price: 2850.75, change: 45.20, volume: 8234567 },
    { symbol: 'TCS', price: 3650.20, change: -25.80, volume: 1534567 },
    { symbol: 'INFY', price: 1485.60, change: 18.45, volume: 4356789 },
    { symbol: 'HDFC', price: 1620.40, change: -12.30, volume: 2654321 },
    { symbol: 'ICICI', price: 950.85, change: 8.75, volume: 5456789 },
    { symbol: 'BHARTI', price: 875.30, change: 15.60, volume: 3234567 },
    { symbol: 'ITC', price: 425.15, change: -3.25, volume: 7654321 },
    { symbol: 'SBIN', price: 580.90, change: 12.40, volume: 6789012 },
  ];



  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use mock data for now
        setStocks(mockStocks);
        setRecentTrades(mockTradingStore.getTrades().slice(0, 5));
        
        // Uncomment when backend is ready
        // const stockData = await getStocks();
        // const tradeData = await getTradeHistory();
        // setStocks(stockData);
        // setRecentTrades(tradeData);
      } catch (err: any) {
        setError('Failed to load data');
      }
    };

    fetchData();
  }, [mockStocks]);

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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let success = false;
      if (action === 'buy') {
        success = mockTradingStore.buyStock(selectedStock, quantity, tradePrice);
        if (success) {
          setSuccess(`Successfully bought ${quantity} shares of ${selectedStock} for $${totalCost.toFixed(2)}`);
        } else {
          setError('Insufficient balance for this trade');
        }
      } else {
        success = mockTradingStore.sellStock(selectedStock, quantity, tradePrice);
        if (success) {
          setSuccess(`Successfully sold ${quantity} shares of ${selectedStock} for $${totalCost.toFixed(2)}`);
        } else {
          setError('Insufficient shares to sell');
        }
      }
      
      if (success) {
        setBalance(mockTradingStore.getBalance());
        setRecentTrades(mockTradingStore.getTrades().slice(0, 5));
        setQuantity(1);
        setLimitPrice('');
      }
    } catch (err: any) {
      setError('Trade failed');
    } finally {
      setLoading(false);
    }
  };

  const selectedStockData = stocks.find(stock => stock.symbol === selectedStock);
  const totalCost = selectedStockData ? 
    (orderType === 'market' ? selectedStockData.price : parseFloat(limitPrice) || 0) * quantity : 0;

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
                      {stock.symbol} - ₹{stock.price.toFixed(2)} ({stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)})
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
                    className={`p-3 rounded-xl border-2 transition-all duration-200 font-medium ${
                      orderType === 'market'
                        ? 'border-indigo-500 bg-indigo-500 text-white'
                        : 'border-gray-600 bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    Market Order
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType('limit')}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 font-medium ${
                      orderType === 'limit'
                        ? 'border-indigo-500 bg-indigo-500 text-white'
                        : 'border-gray-600 bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    Limit Order
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
                      <span className="text-white">${selectedStockData.price.toFixed(2)}</span>
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
