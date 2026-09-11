import React, { createContext, useState, useEffect, useCallback } from 'react';
import { login as loginService, logout as logoutService } from '../services/authService';
import { getLocalAccessToken, clearTokens } from '../services/tokenService';
import { getUserDetailsApi } from '../api/usersApi';
import axiosClient from '../api/axiosClient';
import { getImpersonation, clearImpersonation } from '../services/impersonationService';
export const AuthContext = createContext(null);
export const AuthProvider = ({
  children
}) => {
  const [user, setUser] = useState(null),
    [loading, setLoading] = useState(true);
  const forgetSession = useCallback(() => { clearTokens(); clearImpersonation(); delete axiosClient.defaults.headers.common.Authorization; setUser(null); }, []);
  useEffect(() => {
    window.addEventListener('session-ended', forgetSession);
    return () => window.removeEventListener('session-ended', forgetSession);
  }, [forgetSession]);
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
      } catch (error) {
        if (!getImpersonation() || error.response?.status === 401) clearTokens();
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
    logout,
    forgetSession
  }}>{children}</AuthContext.Provider>;
};
