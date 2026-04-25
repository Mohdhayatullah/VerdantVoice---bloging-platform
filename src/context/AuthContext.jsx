import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getProfile } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(() => {
    try { return JSON.parse(localStorage.getItem('vv_user')) || null; } catch { return null; }
  });
  const [token, setToken]     = useState(() => localStorage.getItem('vv_token') || null);
  const [loading, setLoading] = useState(true);

  const isLoggedIn = !!token;

  const login = useCallback((newToken, userData = null) => {
    localStorage.setItem('vv_token', newToken);
    setToken(newToken);
    if (userData) {
      localStorage.setItem('vv_user', JSON.stringify(userData));
      setUser(userData);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('vv_token');
    localStorage.removeItem('vv_user');
    setToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!localStorage.getItem('vv_token')) return;
    try {
      const res = await getProfile();
      const u = res.data;
      localStorage.setItem('vv_user', JSON.stringify(u));
      setUser(u);
    } catch (_) {}
  }, []);

  useEffect(() => {
    (async () => {
      if (token) await refreshUser();
      setLoading(false);
    })();
  }, []); // eslint-disable-line

  return (
    <AuthContext.Provider value={{ user, token, isLoggedIn, login, logout, refreshUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
