import { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

function Stocks() {
  const [stocks, setStocks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/characters')
      .then(res => {
        const sorted = res.data.sort((a, b) => b.price - a.price);
        setStocks(sorted);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white px-6 py-8 overflow-x-hidden">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-yellow-400 to-red-400 text-transparent bg-clip-text">
            🧙‍♂️ Available Characters
          </h1>
          <p className="text-gray-400 mt-2">Click any stock to view or buy more shares</p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stocks.map((stock) => {
            const isSoldOut = stock.availableShares === 0;
            return (
              <div
                key={stock._id}
                onClick={() => !isSoldOut && navigate(`/stock/${stock._id}`)}
                className={`rounded-xl p-5 border backdrop-blur-md shadow-lg transition-all cursor-pointer ${
                  isSoldOut
                    ? 'bg-red-900/20 border-red-500/30 text-red-300 cursor-not-allowed'
                    : 'bg-slate-800/30 border-white/10 hover:shadow-blue-400/30 hover:border-blue-400/30'
                }`}
              >
                <h2 className="text-xl font-bold mb-1">{stock.name}</h2>
                <p className="text-sm text-gray-400">💰 {stock.price} berries</p>
                {isSoldOut && (
                  <p className="mt-2 text-sm font-semibold text-red-400">❌ Sold Out</p>
                )}
                {!isSoldOut && (
                  <p className="mt-2 text-sm text-green-400">
                    {stock.availableShares} shares available
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Stocks;
