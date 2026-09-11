import axiosClient from './axiosClient';

export const getUserDetailsApi = () => axiosClient.get('/api/users');
export const registerApi = (userData) => axiosClient.post('/api/users', userData);
export const verifyEmailApi = (token) => axiosClient.get(`/api/users/verify-email/${token}`);
export const deleteUserApi = () => axiosClient.delete('/api/users');
export const changePasswordApi = (passwordData) => axiosClient.post('/api/users/change-password', passwordData);
export const getSessionsApi = () => axiosClient.get('/api/users/me/sessions');
export const revokeSessionApi = id => axiosClient.delete(`/api/users/me/sessions/${id}`);
export const revokeOtherSessionsApi = () => axiosClient.delete('/api/users/me/sessions/others');
