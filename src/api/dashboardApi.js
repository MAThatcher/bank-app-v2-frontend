import axiosClient from './axiosClient';

export const getDashboardApi = () => axiosClient.get('/api/dashboard');
