import { useEffect, useRef, useState } from 'react';
import { useNotifications } from '../context/NotificationContext';

function NotificationBell() {
  const {
    notifications,
    unreadCount,
    refresh: fetchNotifications,   
    markAllRead: markAllAsRead 
  } = useNotifications();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setOpen(prev => !prev);
    if (!open) {
      fetchNotifications(); // ⏳ fetch only when dropdown opens
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: '#fff',
          position: 'relative'
        }}
      >
        🔔
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            background: 'red',
            borderRadius: '50%',
            color: 'white',
            fontSize: '10px',
            padding: '2px 5px',
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          right: 0,
          top: '30px',
          background: '#fff',
          color: '#000',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          width: '300px',
          borderRadius: '8px',
          zIndex: 1000,
          maxHeight: '400px',
          overflowY: 'auto',
        }}>
          <div style={{
            padding: '10px',
            borderBottom: '1px solid #ccc',
            fontWeight: 'bold',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>Notifications</span>
            <button
              onClick={markAllAsRead}
              style={{
                fontSize: '12px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#007bff'
              }}
            >
              Mark all read
            </button>
          </div>
          {notifications.length === 0 ? (
            <div style={{ padding: '10px' }}>No notifications</div>
          ) : (
            notifications.map((n, idx) => (
              <div key={idx} style={{
                padding: '10px',
                borderBottom: '1px solid #eee',
                backgroundColor: n.read ? '#f9f9f9' : '#fffbcc'
              }}>
                {n.message}
                <br />
                <small>{new Date(n.date).toLocaleString()}</small>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
