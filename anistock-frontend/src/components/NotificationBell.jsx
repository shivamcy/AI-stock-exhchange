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
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="relative text-white text-xl focus:outline-none bg-transparent border-none p-0"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-[#0d1117] border border-gray-700 rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="px-4 py-3 border-b border-gray-700 flex justify-between items-center text-white font-semibold bg-[#0d1117] rounded-t-xl">
            <span>Notifications</span>
            <button
              onClick={markAllAsRead}
              className="text-sm text-blue-400 hover:underline"
            >
              Mark all read
            </button>
          </div>

          {notifications.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-400">No notifications</div>
          ) : (
            notifications.map((n, idx) => (
              <div
                key={idx}
                className={`px-4 py-3 border-b border-gray-800 text-sm ${
                  n.read ? 'bg-[#0d1117] text-gray-300' : 'bg-yellow-100 text-gray-800'
                }`}
              >
                <p>{n.message}</p>
                <small className="block mt-1 text-xs opacity-70">
                  {new Date(n.date).toLocaleString()}
                </small>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
