import React, { useEffect, useState } from 'react';
import api from '../api';

function Portfolio() {
  const [wallet, setWallet] = useState(0);
  const [holdings, setHoldings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [totalInvested, setTotalInvested] = useState(0);
  const [currentValue, setCurrentValue] = useState(0);
  const [netProfitLoss, setNetProfitLoss] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const res = await api.get('/api/users/portfolio');
      setWallet(res.data.wallet);
      setHoldings(res.data.holdings);
      setTransactions(res.data.recentTransactions);
      setTotalInvested(res.data.totalInvested);
      setCurrentValue(res.data.currentValue);
      setNetProfitLoss(res.data.netProfitLoss);
    } catch (err) {
      setError('❌ Failed to load portfolio');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white px-6 py-8 overflow-x-hidden">
      <div className="max-w-6xl mx-auto space-y-8">

        <header className="text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
            📊 Your Portfolio
          </h1>
        </header>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Wallet & Summary */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-slate-800/40 rounded-xl p-4 text-center border border-white/10 shadow-lg">
            <h3 className="text-sm text-gray-400">💰 Wallet Balance</h3>
            <p className="text-2xl font-bold text-green-400">₿{wallet.toFixed(2)}</p>
          </div>
          <div className="bg-slate-800/40 rounded-xl p-4 text-center border border-white/10 shadow-lg">
            <h3 className="text-sm text-gray-400">💼 Total Invested</h3>
            <p className="text-xl font-bold">₿{totalInvested.toFixed(2)}</p>
          </div>
          <div className="bg-slate-800/40 rounded-xl p-4 text-center border border-white/10 shadow-lg">
            <h3 className="text-sm text-gray-400">📈 Current Value</h3>
            <p className="text-xl font-bold">₿{currentValue.toFixed(2)}</p>
          </div>
          <div className="bg-slate-800/40 rounded-xl p-4 text-center border border-white/10 shadow-lg">
            <h3 className="text-sm text-gray-400">🧮 Net P/L</h3>
            <p className={`text-xl font-bold ${netProfitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              ₿{netProfitLoss.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Holdings */}
        <div className="bg-slate-800/30 rounded-2xl p-6 border border-white/10 shadow-xl backdrop-blur-md">
          <h2 className="text-xl font-bold mb-4">📦 Holdings</h2>
          {holdings.length === 0 ? (
            <p className="text-gray-400">You currently hold no stocks.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="text-gray-400 border-b border-white/10">
                  <tr>
                    <th className="py-2 px-4">Character</th>
                    <th className="py-2 px-4">Anime</th>
                    <th className="py-2 px-4">Qty</th>
                    <th className="py-2 px-4">Avg Buy</th>
                    <th className="py-2 px-4">Current</th>
                    <th className="py-2 px-4">Invested</th>
                    <th className="py-2 px-4">Now Worth</th>
                    <th className="py-2 px-4">P/L</th>
                  </tr>
                </thead>
                <tbody className="text-white">
                  {holdings.map((h, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-slate-800/30 transition">
                      <td className="py-2 px-4">{h.character}</td>
                      <td className="py-2 px-4">{h.anime}</td>
                      <td className="py-2 px-4">{h.quantity}</td>
                      <td className="py-2 px-4">₿{h.avgBuyPrice}</td>
                      <td className="py-2 px-4">₿{h.currentPrice}</td>
                      <td className="py-2 px-4">₿{h.invested.toFixed(2)}</td>
                      <td className="py-2 px-4">₿{h.nowWorth.toFixed(2)}</td>
                      <td className={`py-2 px-4 font-semibold ${h.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        ₿{h.profitLoss.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Transactions */}
        <div className="bg-slate-800/30 rounded-2xl p-6 border border-white/10 shadow-xl backdrop-blur-md">
          <h2 className="text-xl font-bold mb-4">🧾 Recent Transactions</h2>
          {transactions.length === 0 ? (
            <p className="text-gray-400">No recent transactions.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {transactions.map((txn, i) => (
                <li key={i} className="border-l-4 pl-3 py-1 border-blue-500 bg-slate-700/30 rounded-md">
                  <span className="font-semibold">{txn.type.toUpperCase()}</span> — {txn.quantity} × <span className="text-blue-300">{txn.character}</span> @ ₿{txn.price}
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}

export default Portfolio;
