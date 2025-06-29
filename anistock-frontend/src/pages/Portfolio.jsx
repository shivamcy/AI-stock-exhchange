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
      const res = await api.get('/api/users/portfolio'); // 👈 matches your backend
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
    <div style={{ padding: '20px' }}>
      <h2>📊 Your Portfolio</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h3>💰 Wallet Balance:₿{wallet.toFixed(2)}</h3>
      <p>💼 Total Invested: ₿{totalInvested.toFixed(2)}</p>
      <p>📈 Current Value: ₿{currentValue.toFixed(2)}</p>
      <p style={{ color: netProfitLoss >= 0 ? 'green' : 'red' }}>
        🧮 Net Profit/Loss: ₿{netProfitLoss.toFixed(2)}
      </p>

      <h3 style={{ marginTop: '20px' }}>📦 Holdings</h3>
      {holdings.length === 0 ? (
        <p>You currently hold no stocks.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Character</th>
              <th>Anime</th>
              <th>Qty</th>
              <th>Avg Buy Price</th>
              <th>Current Price</th>
              <th>Invested</th>
              <th>Now Worth</th>
              <th>P/L</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((h, i) => (
              <tr key={i}>
                <td>{h.character}</td>
                <td>{h.anime}</td>
                <td>{h.quantity}</td>
                <td>₿{h.avgBuyPrice}</td>
                <td>₿{h.currentPrice}</td>
                <td>₿{h.invested.toFixed(2)}</td>
                <td>₿{h.nowWorth.toFixed(2)}</td>
                <td style={{ color: h.profitLoss >= 0 ? 'green' : 'red' }}>
                ₿{h.profitLoss.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3 style={{ marginTop: '30px' }}>🧾 Recent Transactions</h3>
      {transactions.length === 0 ? (
        <p>No recent transactions.</p>
      ) : (
        <ul>
          {transactions.map((txn, i) => (
            <li key={i}>
              <strong>{txn.type.toUpperCase()}</strong> — {txn.quantity} × {txn.character} @ ₿{txn.price}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Portfolio;
