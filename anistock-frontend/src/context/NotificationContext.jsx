import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api';

const NotificationContext = createContext();
export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    const token = localStorage.getItem('token');
    if (!token) return; // 🚫 Don't fetch if not logged in

    try {
      const res = await api.get('/api/users/notifications');
      setNotifications(res.data);
      setUnreadCount(res.data.filter(n => !n.read).length);
    } catch (err) {
      console.error('❌ Failed to fetch notifications:', err);
    }
  };

  const markAllRead = async () => {
    const token = localStorage.getItem('token');
    if (!token) return; // 🚫 Skip if not logged in

    try {
      await api.put('/api/users/notifications/read');
      fetchNotifications();
    } catch (err) {
      console.error('❌ Failed to mark notifications as read:', err);
    }
  };

  useEffect(() => {
    fetchNotifications(); // Only fetch if token exists
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, refresh: fetchNotifications, markAllRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
