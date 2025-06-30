import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { useNotifications } from '../context/NotificationContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function StockDetail() {
  const { id } = useParams();
  const [character, setCharacter] = useState(null);
  const [buyQty, setBuyQty] = useState(1);
  const [sellQty, setSellQty] = useState(1);
  const [autoQty, setAutoQty] = useState(1);
  const [trigger, setTrigger] = useState('');
  const [type, setType] = useState('buy');
  const [predictions, setPredictions] = useState([]);
  const { refresh } = useNotifications();

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    try {
      const res = await api.get(`/api/characters/${id}/details`);
      setCharacter(res.data);
    } catch (err) {
      toast.error('❌ Failed to fetch stock details');
    }
  };

  const handleBuy = async () => {
    try {
      const res = await api.post('/api/transactions/buy', {
        characterId: id,
        quantity: parseInt(buyQty),
      });
      toast.success(res.data.message || '✅ Purchase successful');
      fetchDetails();
      refresh();
    } catch (err) {
      toast.error(err.response?.data?.error || '❌ Buy failed');
    }
  };

  const handleSell = async () => {
    try {
      const res = await api.post('/api/transactions/sell', {
        characterId: id,
        quantity: parseInt(sellQty),
      });
      toast.success(res.data.message || '✅ Sale successful');
      fetchDetails();
      refresh();
    } catch (err) {
      toast.error(err.response?.data?.error || '❌ Sell failed');
    }
  };

  const handleAutoOrder = async () => {
    try {
      const res = await api.post('/api/users/auto-order', {
        characterId: id,
        quantity: parseInt(autoQty),
        triggerPrice: parseFloat(trigger),
        type,
      });
      toast.success(res.data.message || '✅ Auto order placed');
    } catch (err) {
      toast.error(err.response?.data?.error || '❌ Auto-order failed');
    }
  };

  const handleAskAI = async () => {
    try {
      const res = await api.get(`/api/characters/${id}/predict`);
      setPredictions(res.data.predictedPrices);
    } catch (err) {
      toast.error(err.response?.data?.error || '❌ AI prediction failed');
    }
  };

  if (!character) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        Loading stock details...
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-pink-400 to-violet-500 text-transparent bg-clip-text">
            🧾 {character.name} ({character.anime})
          </h1>
          <p className="text-gray-400 mt-2 text-lg">
            Price: <span className="text-green-400 font-semibold">{character.price} berries</span>
          </p>
          <p className="text-gray-400 text-sm">Available Shares: {character.availableShares}</p>
        </header>

        {/* Chart */}
        <div className="bg-slate-800/30 p-6 rounded-xl border border-white/10 shadow-xl backdrop-blur-md">
          <h2 className="text-xl font-bold mb-4">📈 Price History</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={character.priceHistory.map((p, i) => ({
                  time: `T${i + 1}`,
                  price: p.price || p,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="price" stroke="#60a5fa" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Prediction */}
        <div className="bg-slate-800/30 p-6 rounded-xl border border-white/10 shadow-xl backdrop-blur-md">
          <h2 className="text-xl font-bold mb-4">🤖 AI Prediction</h2>
          <button
            onClick={handleAskAI}
            className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-semibold transition"
          >
            Ask AI
          </button>
          {predictions.length > 0 && (
            <p className="mt-4 text-green-400 text-sm">🔮 {predictions.join(', ')} berries</p>
          )}
        </div>

        {/* Buy/Sell Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Buy */}
          <div className="bg-slate-800/30 p-6 rounded-xl border border-white/10 shadow-xl backdrop-blur-md">
            <h2 className="text-xl font-bold mb-4">🛒 Buy</h2>
            <input
              type="number"
              value={buyQty}
              min="1"
              onChange={(e) => setBuyQty(e.target.value)}
              className="w-full p-2 rounded-md bg-slate-700 text-white mb-4"
            />
            <button
              onClick={handleBuy}
              className="w-full py-2 bg-green-500 hover:bg-green-600 rounded-md font-bold transition"
            >
              Buy Now
            </button>
          </div>

          {/* Sell */}
          <div className="bg-slate-800/30 p-6 rounded-xl border border-white/10 shadow-xl backdrop-blur-md">
            <h2 className="text-xl font-bold mb-4">📤 Sell</h2>
            <input
              type="number"
              value={sellQty}
              min="1"
              onChange={(e) => setSellQty(e.target.value)}
              className="w-full p-2 rounded-md bg-slate-700 text-white mb-4"
            />
            <button
              onClick={handleSell}
              className="w-full py-2 bg-red-500 hover:bg-red-600 rounded-md font-bold transition"
            >
              Sell Now
            </button>
          </div>
        </div>

        {/* Auto Order */}
        <div className="bg-slate-800/30 p-6 rounded-xl border border-white/10 shadow-xl backdrop-blur-md">
          <h2 className="text-xl font-bold mb-4">⚙️ Auto Buy/Sell</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="p-2 rounded-md bg-slate-700 text-white flex-1"
            >
              <option value="buy">Auto Buy</option>
              <option value="sell">Auto Sell</option>
            </select>
            <input
              type="number"
              placeholder="Trigger Price"
              value={trigger}
              onChange={(e) => setTrigger(e.target.value)}
              className="p-2 rounded-md bg-slate-700 text-white flex-1"
            />
            <input
              type="number"
              placeholder="Quantity"
              value={autoQty}
              onChange={(e) => setAutoQty(e.target.value)}
              className="p-2 rounded-md bg-slate-700 text-white flex-1"
            />
            <button
              onClick={handleAutoOrder}
              className="px-4 py-2 rounded-md bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        theme="dark"
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </div>
  );
}

export default StockDetail;
