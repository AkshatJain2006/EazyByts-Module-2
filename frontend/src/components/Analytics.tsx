import React, { useState, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
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
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface AnalyticsData {
  portfolioValue: number[];
  dates: string[];
  performance: number;
  monthlyReturns: number[];
  sectorAllocation: { sector: string; percentage: number; value: number }[];
  riskMetrics: {
    sharpeRatio: number;
    volatility: number;
    maxDrawdown: number;
    beta: number;
  };
}

const Analytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeframe, setTimeframe] = useState<'1M' | '3M' | '6M' | '1Y'>('3M');



  useEffect(() => {
    let isMounted = true;
    
    const fetchAnalytics = async () => {
      try {
        if (isMounted) {
          const token = localStorage.getItem('token');
          if (!token) {
            setError('Please log in to view analytics');
            setLoading(false);
            return;
          }

          // Analytics endpoint doesn't exist yet, use mock data
          const mockAnalytics = {
            portfolioValue: [45000, 47500, 46800, 49200, 51000, 48500, 52300, 54100, 53200, 55800, 57200, 59500],
            dates: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            performance: 24.5,
            monthlyReturns: [2.1, 5.6, -1.5, 5.1, 3.7, -4.9, 7.8, 3.4, -1.7, 4.9, 2.5, 4.0],
            sectorAllocation: [
              { sector: 'Technology', percentage: 45, value: 28350 },
              { sector: 'Healthcare', percentage: 20, value: 12600 },
              { sector: 'Finance', percentage: 15, value: 9450 },
              { sector: 'Consumer', percentage: 12, value: 7560 },
              { sector: 'Energy', percentage: 8, value: 5040 }
            ],
            riskMetrics: {
              sharpeRatio: 1.45,
              volatility: 18.2,
              maxDrawdown: -8.5,
              beta: 1.12
            }
          };
          setAnalytics(mockAnalytics);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.response?.data?.message || 'Failed to load analytics');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAnalytics();
    
    return () => {
      isMounted = false;
    };
  }, [timeframe]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="glass-effect p-8 rounded-2xl">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white font-medium">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="glass-effect p-6 rounded-2xl border border-red-500/30">
          <p className="text-red-100">{error}</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="container mx-auto p-6">
        <div className="glass-effect p-6 rounded-2xl">
          <p className="text-white">No analytics data available</p>
        </div>
      </div>
    );
  }

  const portfolioChartData = {
    labels: analytics.dates,
    datasets: [
      {
        label: 'Portfolio Value',
        data: analytics.portfolioValue,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const returnsChartData = {
    labels: analytics.dates,
    datasets: [
      {
        label: 'Monthly Returns (%)',
        data: analytics.monthlyReturns,
        backgroundColor: analytics.monthlyReturns.map(val => 
          val >= 0 ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)'
        ),
        borderColor: analytics.monthlyReturns.map(val => 
          val >= 0 ? '#22C55E' : '#EF4444'
        ),
        borderWidth: 1,
      },
    ],
  };

  const sectorChartData = {
    labels: analytics.sectorAllocation.map(s => s.sector),
    datasets: [
      {
        data: analytics.sectorAllocation.map(s => s.percentage),
        backgroundColor: [
          '#3B82F6',
          '#8B5CF6',
          '#10B981',
          '#F59E0B',
          '#EF4444',
        ],
        borderWidth: 0,
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

  const sectorChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'white',
          padding: 20,
        },
      },
    },
  };

  return (
    <div className="container mx-auto p-6 space-y-8 fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Analytics</h1>
          <p className="text-white/70">Comprehensive portfolio analysis and insights</p>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="flex space-x-2">
            {(['1M', '3M', '6M', '1Y'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                className={`px-4 py-3 rounded-xl text-base font-bold transition-all duration-300 transform hover:scale-105 shadow-lg border-2 ${
                  timeframe === period
                    ? 'timeframe-active shadow-indigo-500/25 border-indigo-500 bg-indigo-600 text-white'
                    : 'timeframe-inactive border-white/20 bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-effect p-6 rounded-2xl card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm font-medium">Total Return</p>
              <p className={`text-3xl font-bold ${
                analytics.performance >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {analytics.performance >= 0 ? '+' : ''}{analytics.performance.toFixed(1)}%
              </p>
            </div>

          </div>
        </div>
        
        <div className="glass-effect p-6 rounded-2xl card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm font-medium">Sharpe Ratio</p>
              <p className="text-3xl font-bold text-white">{analytics.riskMetrics.sharpeRatio.toFixed(2)}</p>
            </div>

          </div>
        </div>
        
        <div className="glass-effect p-6 rounded-2xl card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm font-medium">Volatility</p>
              <p className="text-3xl font-bold text-white">{analytics.riskMetrics.volatility.toFixed(1)}%</p>
            </div>

          </div>
        </div>
        
        <div className="glass-effect p-6 rounded-2xl card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm font-medium">Max Drawdown</p>
              <p className="text-3xl font-bold text-red-400">{analytics.riskMetrics.maxDrawdown.toFixed(1)}%</p>
            </div>

          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Portfolio Performance */}
        <div className="glass-effect p-6 rounded-2xl">
          <h3 className="text-xl font-semibold text-white mb-6">Portfolio Performance</h3>
          <div className="h-80">
            <Line data={portfolioChartData} options={chartOptions} />
          </div>
        </div>
        
        {/* Monthly Returns */}
        <div className="glass-effect p-6 rounded-2xl">
          <h3 className="text-xl font-semibold text-white mb-6">Monthly Returns</h3>
          <div className="h-80">
            <Bar data={returnsChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Sector Allocation & Risk Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sector Allocation */}
        <div className="glass-effect p-6 rounded-2xl">
          <h3 className="text-xl font-semibold text-white mb-6">Sector Allocation</h3>
          <div className="h-80">
            <Doughnut data={sectorChartData} options={sectorChartOptions} />
          </div>
        </div>
        
        {/* Risk Metrics Details */}
        <div className="glass-effect p-6 rounded-2xl">
          <h3 className="text-xl font-semibold text-white mb-6">Risk Analysis</h3>
          <div className="space-y-6">
            <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
              <div>
                <p className="text-white font-medium">Beta</p>
                <p className="text-white/70 text-sm">Market correlation</p>
              </div>
              <p className="text-2xl font-bold text-white">{analytics.riskMetrics.beta.toFixed(2)}</p>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-white font-medium mb-4">Sector Breakdown</h4>
              <div className="space-y-3">
                {analytics.sectorAllocation.map((sector, index) => (
                  <div key={sector.sector} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full border-2 border-white/20"
                          style={{ backgroundColor: sectorChartData.datasets[0].backgroundColor[index] }}
                        ></div>
                        <span className="text-white font-medium">{sector.sector}</span>
                      </div>
                      <span className="text-white font-bold text-lg">{sector.percentage}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="w-full bg-white/10 rounded-full h-2 mr-3">
                        <div 
                          className="h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${sector.percentage}%`,
                            backgroundColor: sectorChartData.datasets[0].backgroundColor[index]
                          }}
                        ></div>
                      </div>
                      <span className="text-white/80 font-medium">${sector.value.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            

          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
