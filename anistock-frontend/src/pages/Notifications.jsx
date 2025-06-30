import { useEffect, useState } from 'react';
import api from '../api';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/api/users/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error('❌ Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.put('/api/users/notifications/read');
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error("❌ Mark read error:", err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>🔔 Notifications</h2>
      <button
        onClick={handleMarkAllRead}
        style={{ marginBottom: '15px', padding: '6px 12px', cursor: 'pointer' }}
      >
        Mark All as Read
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {notifications.map((n, idx) => (
            <li
              key={idx}
              style={{
                backgroundColor: n.read ? '#e0e0e0' : '#fff3cd',
                padding: '10px',
                marginBottom: '10px',
                borderLeft: `4px solid ${n.read ? '#999' : '#f0ad4e'}`,
                borderRadius: '4px'
              }}
            >
              <strong>{n.message}</strong>
              <br />
              <small>{new Date(n.date).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Notifications;
