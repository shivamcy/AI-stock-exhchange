import { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

function Stocks() {
  const [stocks, setStocks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/characters')
      .then(res => {
        const sorted = res.data.sort((a, b) => b.price - a.price); // Sort by price descending
        setStocks(sorted);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Available Characters</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {stocks.map((stock) => (
          <li
            key={stock._id}
            onClick={() => navigate(`/stock/${stock._id}`)}
            style={{
              cursor: 'pointer',
              padding: '10px',
              border: '1px solid #ddd',
              marginBottom: '10px',
              color: stock.availableShares === 0 ? 'red' : 'black', // 🔴 mark out of stock
              backgroundColor: stock.availableShares === 0 ? '#ffecec' : 'white'
            }}
          >
            <strong>{stock.name}</strong> – 💰 {stock.price} berries
            {stock.availableShares === 0 && <span style={{ marginLeft: '10px' }}> Opps! Sold Out</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Stocks;
