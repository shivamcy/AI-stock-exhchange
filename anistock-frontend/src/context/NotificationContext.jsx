import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/api/users/notifications');
      setNotifications(res.data);
      setUnreadCount(res.data.filter(n => !n.read).length);
    } catch (err) {
      console.error('❌ Failed to fetch notifications:', err);
    }
  };

  const markAllRead = async () => {
    try {
      await api.put('/api/users/notifications/read');
      fetchNotifications();
    } catch (err) {
      console.error('❌ Failed to mark notifications as read:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      refresh: fetchNotifications,
      markAllRead,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
