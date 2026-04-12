import { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../../features/auth/api/authApi';
import { clearSession, getAccessToken, getStoredUser, saveSession, setStoredUser } from '../auth/sessionStore';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser());
  const [token, setToken] = useState(getAccessToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const syncToken = (event) => {
      if (!isActive) return;
      setToken(event.detail?.token || null);
    };

    const syncUser = (event) => {
      if (!isActive) return;
      setUser(event.detail?.user || getStoredUser());
    };

    const clearAuthState = () => {
      if (!isActive) return;
      setToken(null);
      setUser(null);
    };

    window.addEventListener('lv:token-changed', syncToken);
    window.addEventListener('lv:user-changed', syncUser);
    window.addEventListener('lv:auth-cleared', clearAuthState);

    const restoreSession = async () => {
      try {
        const response = await authApi.refreshSession();
        if (!isActive) return;

        const session = response.data;
        if (session?.accessToken && session?.user) {
          saveSession(session);
          setToken(session.accessToken);
          setUser(session.user);
        } else {
          clearSession();
        }
      } catch {
        clearSession();
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    restoreSession();

    return () => {
      isActive = false;
      window.removeEventListener('lv:token-changed', syncToken);
      window.removeEventListener('lv:user-changed', syncUser);
      window.removeEventListener('lv:auth-cleared', clearAuthState);
    };
  }, []);

  const login = (tokenValue, userData) => {
    saveSession({ accessToken: tokenValue, user: userData });
    setToken(tokenValue);
    setUser(userData);
  };

  const updateUser = (userData) => {
    const updated = { ...(user || {}), ...userData };
    setStoredUser(updated);
    setUser(updated);
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      clearSession();
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
