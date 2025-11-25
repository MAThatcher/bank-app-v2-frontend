import axiosClient from './axiosClient';

export const loginApi = (credentials) => axiosClient.post('/api/auth/login', credentials);
export const logoutApi = () => axiosClient.post('/api/auth/logout');
export const refreshTokenApi = (refreshToken) => axiosClient.post('/api/auth/refresh', { refreshToken });

export const forgotPasswordApi = (email) => axiosClient.post('/api/auth/forgot-password', { email });
export const resetPasswordApi = (password, token) => axiosClient.post('/api/auth/reset-password', { password, token });