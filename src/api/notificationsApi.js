import axiosClient from './axiosClient';

export const getNotificationsApi = (params = {}) => axiosClient.get('/api/notification', { params });
export const getNotificationApi = (notificationId) => axiosClient.get(`/api/notification/${notificationId}`);
export const dismissNotificationApi = (notificationId) => axiosClient.patch(`/api/notification/${notificationId}`);
export const createNotificationApi = (notificationData) => axiosClient.post('/api/notification', notificationData);

export const dismissAllNotificationsApi = () => axiosClient.patch('/api/notification');
export const getUnreadCountApi = () => axiosClient.get('/api/notification/unread/count');
export const getUnreadNotificationsApi = () => axiosClient.get('/api/notification/unread');
export const getNotificationsByTypeApi = (type) => axiosClient.get(`/api/notification/type/${type}`);
