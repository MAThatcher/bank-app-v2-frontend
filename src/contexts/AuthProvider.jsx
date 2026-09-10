import React, { createContext, useState, useEffect } from 'react';
import { login as loginService, logout as logoutService } from '../services/authService';
import { getLocalAccessToken, clearTokens } from '../services/tokenService';
import { getUserDetailsApi } from '../api/usersApi';
export const AuthContext = createContext(null);
export const AuthProvider = ({
  children
}) => {
  const [user, setUser] = useState(null),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    const bootstrap = async () => {
      try {
        if (getLocalAccessToken()) {
          const {
            data
          } = await getUserDetailsApi();
          if (active) setUser(data);
        }
      } catch {
        clearTokens();
        if (active) setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    };
    bootstrap();
    return () => {
      active = false;
    };
  }, []);
  const login = async credentials => {
    try {
      await loginService(credentials);
      const {
        data
      } = await getUserDetailsApi();
      setUser(data);
      return {
        ok: true
      };
    } catch (err) {
      clearTokens();
      return {
        ok: false,
        error: err.response?.data?.error || err.response?.data?.message || err.message
      };
    }
  };
  const logout = async () => {
    await logoutService();
    setUser(null);
  };
  return <AuthContext.Provider value={{
    user,
    loading,
    login,
    logout
  }}>{children}</AuthContext.Provider>;
};
