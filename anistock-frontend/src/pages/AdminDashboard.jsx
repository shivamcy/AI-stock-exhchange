import React, { useEffect, useState } from 'react';
import api from '../api';

function AdminDashboard() {
  // Character states
  const [characterData, setCharacterData] = useState({
    name: '',
    description: '',
    price: '',
    availableShares: '',
    trendScore: '',
  });
  const [message, setMessage] = useState('');

  // IPO states
  const [characters, setCharacters] = useState([]);
  const [ipoCharId, setIpoCharId] = useState('');
  const [ipoPrice, setIpoPrice] = useState('');
  const [ipoShares, setIpoShares] = useState('');
  const [ipoDeadline, setIpoDeadline] = useState('');
  const [activeIpos, setActiveIpos] = useState([]);
  const [ipoMessage, setIpoMessage] = useState('');

  // Load characters + IPOs
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

  // Handle Add Character
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
      fetchCharacters(); // Refresh for IPO dropdown
    } catch (err) {
      setMessage(err.response?.data?.error || '❌ Failed to add character');
    }
  };

  // Handle Create IPO
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

  // Handle Allot IPO
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
    <div style={{ padding: '20px' }}>
      <h2>🧑‍💼 Admin Dashboard</h2>

      {/* Add Character */}
      <h3>➕ Add New Character</h3>
      <form onSubmit={handleAddCharacter}>
        <input type="text" name="name" placeholder="Name" value={characterData.name} onChange={handleChange} required /><br />
        <input type="text" name="anime" placeholder="anime" value={characterData.anime} onChange={handleChange} /><br />
        <input type="number" name="price" placeholder="Price" value={characterData.price} onChange={handleChange} required /><br />
        <input type="number" name="availableShares" placeholder="Available Shares (default 1000)" value={characterData.availableShares} onChange={handleChange} /><br />
        <input type="number" name="trendScore" placeholder="Trend Score (default 0)" value={characterData.trendScore} onChange={handleChange} /><br />
        <button type="submit">Add Character</button>
      </form>
      {message && <p style={{ marginTop: '15px', color: 'green' }}>{message}</p>}

      <hr style={{ margin: '30px 0' }} />

      {/* Create IPO */}
      <h3>📈 Create IPO</h3>
      <select value={ipoCharId} onChange={(e) => setIpoCharId(e.target.value)} required>
        <option value="">-- Select Character --</option>
        {characters.map((char) => (
          <option key={char._id} value={char._id}>{char.name}</option>
        ))}
      </select><br />
      <input type="number" placeholder="IPO Price" value={ipoPrice} onChange={(e) => setIpoPrice(e.target.value)} /><br />
      <input type="number" placeholder="Total Shares" value={ipoShares} onChange={(e) => setIpoShares(e.target.value)} /><br />
      <input type="datetime-local" value={ipoDeadline} onChange={(e) => setIpoDeadline(e.target.value)} /><br />
      <button onClick={handleCreateIPO}>Create IPO</button>
      {ipoMessage && <p style={{ marginTop: '15px', color: 'green' }}>{ipoMessage}</p>}

      {/* Active IPOs */}
      <h3 style={{ marginTop: '40px' }}>📋 Active IPOs</h3>
      {activeIpos.length === 0 ? (
        <p>No active IPOs available</p>
      ) : (
        <ul>
          {activeIpos.map(ipo => (
            <li key={ipo._id}>
              <strong>{ipo.characterId?.name}</strong> | ₹{ipo.price} | Deadline: {new Date(ipo.deadline).toLocaleString()}
              <button onClick={() => handleAllotIPO(ipo._id)} style={{ marginLeft: '10px' }}>🎯 Allot</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminDashboard;
