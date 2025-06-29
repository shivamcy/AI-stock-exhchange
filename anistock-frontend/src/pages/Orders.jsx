// src/pages/Orders.jsx
import React, { useEffect, useState } from 'react';
import api from '../api';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/api/users/auto-orders');
      setOrders(res.data);
    } catch (err) {
      setMessage('❌ Failed to fetch orders');
    }
  };

  const handleDelete = async (orderId) => {
    try {
      await api.delete(`/api/users/auto-orders/${orderId}`);
      setMessage('🗑 Order deleted');
      fetchOrders(); // refresh
    } catch (err) {
      setMessage(err.response?.data?.error || '❌ Failed to delete order');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>📋 Your Auto Orders</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}

      {orders.length === 0 ? (
        <p>You don't have any auto orders.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Character</th>
              <th>Anime</th>
              <th>Type</th>
              <th>Qty</th>
              <th>Trigger Price</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id}>
                <td>{o.characterName}</td>
                <td>{o.anime}</td>
                <td>{o.type.toUpperCase()}</td>
                <td>{o.quantity}</td>
                <td>₹{o.triggerPrice}</td>
                <td style={{ color: o.active ? 'green' : 'gray' }}>
                  {o.active ? 'Active' : 'Inactive'}
                </td>
                <td>{new Date(o.createdAt).toLocaleString()}</td>
                <td>
                  <button onClick={() => handleDelete(o._id)} style={{ color: 'red' }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Orders;
