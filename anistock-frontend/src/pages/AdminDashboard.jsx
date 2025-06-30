import React, { useEffect, useState } from 'react';
import api from '../api';

function AdminDashboard() {
  const [characterData, setCharacterData] = useState({
    name: '',
    description: '',
    price: '',
    availableShares: '',
    trendScore: '',
  });
  const [message, setMessage] = useState('');

  const [characters, setCharacters] = useState([]);
  const [ipoCharId, setIpoCharId] = useState('');
  const [ipoPrice, setIpoPrice] = useState('');
  const [ipoShares, setIpoShares] = useState('');
  const [ipoDeadline, setIpoDeadline] = useState('');
  const [activeIpos, setActiveIpos] = useState([]);
  const [ipoMessage, setIpoMessage] = useState('');

  useEffect(() => {
    fetchCharacters();
    fetchActiveIPOs();
  }, []);

  const fetchCharacters = async () => {
    try {
      const res = await api.get('/api/characters');
      setCharacters(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch characters");
    }
  };

  const fetchActiveIPOs = async () => {
    try {
      const res = await api.get('/api/ipo/active');
      setActiveIpos(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch IPOs");
    }
  };

  const handleChange = (e) => {
    setCharacterData({ ...characterData, [e.target.name]: e.target.value });
  };

  const handleAddCharacter = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/admin/add-character', {
        ...characterData,
        price: parseFloat(characterData.price),
        availableShares: parseInt(characterData.availableShares || 1000),
        trendScore: parseInt(characterData.trendScore || 0)
      });
      setMessage(res.data.message);
      setCharacterData({ name: '', description: '', price: '', availableShares: '', trendScore: '' });
      fetchCharacters();
    } catch (err) {
      setMessage(err.response?.data?.error || '❌ Failed to add character');
    }
  };

  const handleCreateIPO = async () => {
    try {
      const res = await api.post('/api/admin/create-ipo', {
        characterId: ipoCharId,
        price: parseFloat(ipoPrice),
        totalShares: parseInt(ipoShares),
        deadline: ipoDeadline
      });
      setIpoMessage(res.data.message);
      setIpoCharId('');
      setIpoPrice('');
      setIpoShares('');
      setIpoDeadline('');
      fetchActiveIPOs();
    } catch (err) {
      setIpoMessage(err.response?.data?.error || "❌ IPO creation failed");
    }
  };

  const handleAllotIPO = async (ipoId) => {
    try {
      const res = await api.post(`/api/admin/allot-ipo/${ipoId}`);
      alert(res.data.message);
      fetchActiveIPOs();
    } catch (err) {
      alert(err.response?.data?.error || "❌ IPO allotment failed");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto text-white">
      <h2 className="text-2xl font-bold mb-6">🧑‍💼 Admin Dashboard</h2>

      {/* ➕ Add New Character */}
      <div className="bg-[#1f2937] p-5 rounded-xl mb-10">
        <h3 className="text-xl font-semibold mb-4">➕ Add New Character</h3>
        <form onSubmit={handleAddCharacter} className="grid gap-3">
          <input type="text" name="name" placeholder="Name" value={characterData.name} onChange={handleChange} required className="input" />
          <input type="text" name="anime" placeholder="Anime" value={characterData.anime} onChange={handleChange} className="input" />
          <input type="number" name="price" placeholder="Price" value={characterData.price} onChange={handleChange} required className="input" />
          <input type="number" name="availableShares" placeholder="Available Shares (default 1000)" value={characterData.availableShares} onChange={handleChange} className="input" />
          <input type="number" name="trendScore" placeholder="Trend Score (default 0)" value={characterData.trendScore} onChange={handleChange} className="input" />
          <button type="submit" className="btn-primary mt-2">Add Character</button>
        </form>
        {message && <p className="text-green-400 mt-3">{message}</p>}
      </div>

      {/* 📈 Create IPO */}
      <div className="bg-[#1f2937] p-5 rounded-xl mb-10">
        <h3 className="text-xl font-semibold mb-4">📈 Create IPO</h3>
        <div className="grid gap-3">
          <select value={ipoCharId} onChange={(e) => setIpoCharId(e.target.value)} className="input">
            <option value="">-- Select Character --</option>
            {characters.map((char) => (
              <option key={char._id} value={char._id}>{char.name}</option>
            ))}
          </select>
          <input type="number" placeholder="IPO Price" value={ipoPrice} onChange={(e) => setIpoPrice(e.target.value)} className="input" />
          <input type="number" placeholder="Total Shares" value={ipoShares} onChange={(e) => setIpoShares(e.target.value)} className="input" />
          <input type="datetime-local" value={ipoDeadline} onChange={(e) => setIpoDeadline(e.target.value)} className="input" />
          <button onClick={handleCreateIPO} className="btn-primary mt-2">Create IPO</button>
        </div>
        {ipoMessage && <p className="text-green-400 mt-3">{ipoMessage}</p>}
      </div>

      {/* 📋 Active IPOs */}
      <div className="bg-[#1f2937] p-5 rounded-xl">
        <h3 className="text-xl font-semibold mb-4">📋 Active IPOs</h3>
        {activeIpos.length === 0 ? (
          <p className="text-gray-400">No active IPOs available</p>
        ) : (
          <ul className="space-y-3">
            {activeIpos.map(ipo => (
              <li key={ipo._id} className="bg-[#111827] p-3 rounded-lg flex justify-between items-center">
                <div>
                  <strong>{ipo.characterId?.name}</strong><br />
                  <span className="text-sm text-gray-400">₹{ipo.price} | Deadline: {new Date(ipo.deadline).toLocaleString()}</span>
                </div>
                <button onClick={() => handleAllotIPO(ipo._id)} className="btn-secondary">🎯 Allot</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
