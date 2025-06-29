import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin') === 'true');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const admin = localStorage.getItem('isAdmin');
    setIsLoggedIn(!!token);
    setIsAdmin(admin === 'true');
  }, []);

  const login = (token, adminFlag) => {
    localStorage.setItem('token', token);
    localStorage.setItem('isAdmin', adminFlag); // Store as string
    setIsLoggedIn(true);
    setIsAdmin(!!adminFlag); // Use as boolean
  };

  const logout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
