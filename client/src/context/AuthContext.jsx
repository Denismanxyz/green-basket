import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('gbms_user') || 'null'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('gbms_token');
    if (!token) return;
    api.get('/auth/me').then((res) => setUser(res.data.user)).catch(() => logout());
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('gbms_token', res.data.token);
      localStorage.setItem('gbms_user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      return res.data.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('gbms_token');
    localStorage.removeItem('gbms_user');
    setUser(null);
  };

  const value = useMemo(() => ({ user, login, logout, loading, setUser }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
