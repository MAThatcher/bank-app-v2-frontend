import axiosClient from './axiosClient';


export const loginApi = (credentials) => axiosClient.post('/api/auth/login', credentials);
export const logoutApi = () => axiosClient.post('api/auth/logout');
export const refreshTokenApi = (refreshToken) => axiosClient.post('api/auth/refresh', { refreshToken });