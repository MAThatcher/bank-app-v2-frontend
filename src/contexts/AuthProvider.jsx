import React, { createContext, useState, useEffect, useCallback } from 'react';
import { login as loginService, logout as logoutService } from '../services/authService';
import { getLocalAccessToken } from '../services/tokenService';


export const AuthContext = createContext(null);


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    const bootstrapAuth = useCallback(async () => {
        const token = getLocalAccessToken();
        if (!token) {
            setLoading(false);
            return;
        }
        // TODO: fetch api/users/ to populate user
        try {
            // const { data } = await axiosClient.get('/auth/me');
            // setUser(data.user);
            setUser({});
        } catch (err) {
            console.log(err);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);


    useEffect(() => {
        bootstrapAuth();
    }, [bootstrapAuth]);


    const login = async (credentials) => {
        setLoading(true);
        try {
            const { user } = await loginService(credentials);
            setUser(user);
            return { ok: true };
        } catch (err) {
            return { ok: false, error: err?.response?.data?.message || err.message };
        } finally {
            setLoading(false);
        }
    };


    const logout = async () => {
        await logoutService();
        setUser(null);
    };


    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};