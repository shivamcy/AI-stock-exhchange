import { useEffect, useState } from 'react';
import api from '../api';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

function Home() {
  const [stocks, setStocks] = useState([]);
  const [trending, setTrending] = useState([]);
  const [showAllStocks, setShowAllStocks] = useState(false);
  const [displayedStocks, setDisplayedStocks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stockRes = await api.get('/api/characters');
        setStocks(stockRes.data);

        const trendingRes = await api.get('/api/characters/trending');
        setTrending(trendingRes.data.slice(0, 3));
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setDisplayedStocks(showAllStocks ? stocks : stocks.slice(0, 5));
  }, [stocks, showAllStocks]);

  const labels = ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM'];

  const chartData = labels.map((time) => {
    const dataPoint = { time };
    displayedStocks.forEach((char) => {
      if (char.history && char.history.length > 0) {
        const historyPoint = char.history.find((h) => h.timestamp === time);
        dataPoint[char.name] = historyPoint ? historyPoint.price : char.price;
      } else {
        dataPoint[char.name] = char.price;
      }
    });
    return dataPoint;
  });

  const colors = [
    '#60a5fa',
    '#34d399',
    '#fbbf24',
    '#f472b6',
    '#a78bfa',
    '#fb7185',
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800/95 border border-white/20 rounded-lg p-3 shadow-xl backdrop-blur-sm">
          <p className="text-white font-semibold mb-2">{`Time: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value} berries`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white overflow-x-hidden">
      {/* Header */}
      <header className="px-6 py-8 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
          📈 Grand Line Exchange
        </h1>
        <p className="text-gray-400 mt-2">AI-enabled live price trends of anime character stocks</p>
      </header>

      {/* Main Content */}
      <main className="flex flex-col lg:flex-row px-6 gap-6 flex-1 pb-6">
        {/* Chart Section */}
        <div className="flex-1 lg:w-3/4 bg-slate-800/20 rounded-2xl p-6 backdrop-blur-md shadow-2xl border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              📊 Market Overview
            </h2>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowAllStocks(!showAllStocks)}
                className={`px-0.5 py-0.5 rounded-lg font-semibold transition-all duration-300 ${
                  showAllStocks
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                {showAllStocks ? `Showing All (${stocks.length})` : `Show All Stocks (${stocks.length})`}
              </button>
              <div className="text-sm text-gray-400">
                Live updates every 10 seconds
              </div>
            </div>
          </div>

          {displayedStocks.length > 0 ? (
            <div className="h-96 lg:h-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <defs>
                    {displayedStocks.map((stock, index) => (
                      <linearGradient key={stock._id} id={`gradient${index}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={colors[index % colors.length]} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={colors[index % colors.length]} stopOpacity={0.1} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ color: '#e5e7eb', paddingTop: '20px' }} />
                  {displayedStocks.map((stock, index) => (
                    <Area
                      key={stock._id}
                      type="monotone"
                      dataKey={stock.name}
                      stroke={colors[index % colors.length]}
                      strokeWidth={3}
                      fillOpacity={1}
                      fill={`url(#gradient${index})`}
                      dot={{ fill: colors[index % colors.length], strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: colors[index % colors.length], strokeWidth: 2 }}
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-96 lg:h-[500px] flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">📊</div>
                <p className="text-gray-400 text-lg">Loading stock data...</p>
                <p className="text-gray-500 text-sm mt-2">Fetching character prices from the Grand Line</p>
              </div>
            </div>
          )}
        </div>

        {/* Trending + Stats */}
        <div className="lg:w-1/4 flex flex-col gap-4">
          <div className="bg-slate-800/20 rounded-2xl p-6 backdrop-blur-md shadow-2xl border border-white/10">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              🔥 Trending Now
            </h2>
            <div className="space-y-3">
              {trending.map((char, idx) => (
                <div
                  key={char._id}
                  className="bg-gradient-to-r from-slate-700/50 to-slate-600/30 rounded-xl p-4 border border-white/10 hover:border-blue-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold text-blue-400">#{idx + 1}</span>
                    <div className="text-right">
                      <div className="text-xs text-gray-400">Current Price</div>
                      <div className="text-lg font-bold text-green-400">{char.price}</div>
                      <div className="text-xs text-gray-300">berries</div>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white">{char.name}</h3>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-2 bg-slate-600 rounded-full flex-1">
                      <div
                        className="h-2 bg-gradient-to-r from-green-400 to-blue-400 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((char.price / 1500) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-400">
                      {Math.round((char.price / 1500) * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800/20 rounded-2xl p-6 backdrop-blur-md shadow-2xl border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4">📈 Market Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Characters</span>
                <span className="text-white font-semibold">{stocks.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Displayed</span>
                <span className="text-blue-400 font-semibold">{displayedStocks.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Avg Price</span>
                <span className="text-green-400 font-semibold">
                  {displayedStocks.length > 0
                    ? Math.round(displayedStocks.reduce((sum, s) => sum + s.price, 0) / displayedStocks.length)
                    : 0}{' '}
                  berries
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Market Status</span>
                <span className="text-green-400 font-semibold flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  Live
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 mt-8 bg-slate-900/50 border-t border-white/10 backdrop-blur-sm">
        <p className="text-gray-400 text-sm">&copy; 2025 Grand Line Exchange</p>
        <p className="mt-2 text-gray-300">
          Developed by{' '}
          <a
            href="https://github.com/shivamcy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline font-bold transition-colors"
          >
            shivamcy
          </a>{' '}
          with Straw Hat ☠️
        </p>
      </footer>
    </div>
  );
}

export default Home;
