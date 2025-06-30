import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { useNotifications } from '../context/NotificationContext';




function StockDetail() {
  const { id } = useParams();
  const [character, setCharacter] = useState(null);
  const [buyQty, setBuyQty] = useState(1);
  const [sellQty, setSellQty] = useState(1);
  const [autoQty, setAutoQty] = useState(1);
  const [trigger, setTrigger] = useState('');
  const [type, setType] = useState('buy');
  const [message, setMessage] = useState('');
  const [predictions, setPredictions] = useState([]);
  const { refresh } = useNotifications(); // ✅ Add this at the top of your component

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    try {
      const res = await api.get(`/api/characters/${id}/details`);
      setCharacter(res.data);
    } catch (err) {
      setMessage('❌ Failed to fetch stock details');
    }
  };

  const handleBuy = async () => {
    try {
      const res = await api.post('/api/transactions/buy', {
        characterId: id,
        quantity: parseInt(buyQty),
      });
      setMessage(res.data.message);
      fetchDetails();
      refresh();
    } catch (err) {
      setMessage(err.response?.data?.error || '❌ Buy failed');
    }
  };

  const handleSell = async () => {
    try {
      const res = await api.post('/api/transactions/sell', {
        characterId: id,
        quantity: parseInt(sellQty),
      });
      setMessage(res.data.message);
      fetchDetails();
      refresh();
    } catch (err) {
      setMessage(err.response?.data?.error || '❌ Sell failed');
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
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.error || '❌ Auto-order failed');
    }
  };

  const handleAskAI = async () => {
    try {
      const res = await api.get(`/api/characters/${id}/predict`);
      setPredictions(res.data.predictedPrices);
    } catch (err) {
      setMessage(err.response?.data?.error || '❌ AI prediction failed');
    }
  };

  if (!character) return <div>Loading stock details...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>{character.name} ({character.anime})</h2>
      <p><strong>Price:</strong> ₹{character.price}</p>
      <p><strong>Available Shares:</strong> {character.availableShares}</p>

      {/* 📈 Line Graph */}
      <div style={{ maxWidth: '600px', marginTop: '20px' }}>
        <h3>Price History</h3>
        <LineChart
          width={600}
          height={300}
          data={character.priceHistory.map((p, index) => ({
            time: `T${index + 1}`,
            price: p.price || p,
          }))}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="price" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </div>

      {/* 🧠 AI Predictions */}
      <div style={{ marginTop: '30px' }}>
        <h3>Ask AI Prediction</h3>
        <button onClick={handleAskAI}>Get AI Predictions</button>
        {predictions.length > 0 && (
          <p style={{ marginTop: '10px' }}>🔮 Predicted Prices: {predictions.join(', ')}</p>
        )}
      </div>

      {/* 💰 Buy */}
      <div style={{ marginTop: '30px' }}>
        <h3>Buy</h3>
        <input type="number" value={buyQty} min="1" onChange={(e) => setBuyQty(e.target.value)} />
        <button onClick={handleBuy}>Buy</button>
      </div>

      {/* 📤 Sell */}
      <div style={{ marginTop: '20px' }}>
        <h3>Sell</h3>
        <input type="number" value={sellQty} min="1" onChange={(e) => setSellQty(e.target.value)} />
        <button onClick={handleSell}>Sell</button>
      </div>

      {/* 🤖 Auto Buy/Sell */}
      <div style={{ marginTop: '20px' }}>
        <h3>Auto Buy/Sell</h3>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="buy">Auto Buy</option>
          <option value="sell">Auto Sell</option>
        </select>
        <input
          type="number"
          placeholder="Trigger Price"
          value={trigger}
          onChange={(e) => setTrigger(e.target.value)}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={autoQty}
          onChange={(e) => setAutoQty(e.target.value)}
        />
        <button onClick={handleAutoOrder}>Place Auto Order</button>
      </div>

      {/* 📬 Feedback */}
      {message && <p style={{ marginTop: '20px', color: 'green' }}>{message}</p>}
    </div>
  );
}

export default StockDetail;
