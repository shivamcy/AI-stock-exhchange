import React, { useEffect, useState } from 'react';
import api from '../api';

function IPO() {
  const [ipos, setIpos] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchIpos();
  }, []);

  const fetchIpos = async () => {
    try {
      const res = await api.get('/api/ipo'); // You need to implement GET /api/ipo to fetch all
      setIpos(res.data);
    } catch (err) {
      setMessage('❌ Failed to fetch IPOs');
    }
  };

  const handleApply = async (ipoId) => {
    try {
      const res = await api.post(`/api/ipo/apply/${ipoId}`);
      setMessage(res.data.message);
      fetchIpos(); // Refresh list to reflect applied
    } catch (err) {
      setMessage(err.response?.data?.error || '❌ Failed to apply for IPO');
    }
  };

  const isDeadlinePassed = (deadline) => new Date(deadline) < new Date();

  return (
    <div style={{ padding: '20px' }}>
      <h2>Available IPOs</h2>

      {message && <p style={{ color: 'green' }}>{message}</p>}

      {ipos.length === 0 ? (
        <p>No IPOs currently available.</p>
      ) : (
        <div>
          {ipos.map((ipo) => (
            <div key={ipo._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '15px' }}>
              <h3>{ipo.character?.name || 'Unnamed Character'}</h3>
              <p><strong>Price per Share:</strong> ₹{ipo.price}</p>
              <p><strong>Total Shares:</strong> {ipo.totalShares}</p>
              <p><strong>Deadline:</strong> {new Date(ipo.deadline).toLocaleString()}</p>
              <p><strong>Applicants:</strong> {ipo.appliedUsers?.length || 0}</p>

              {isDeadlinePassed(ipo.deadline) ? (
                <p style={{ color: 'gray' }}>⏱ IPO Closed</p>
              ) : ipo.alreadyApplied ? (
                <p style={{ color: 'green' }}>✅ Already Applied</p>
              ) : (
                <button onClick={() => handleApply(ipo._id)}>Apply</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default IPO;
