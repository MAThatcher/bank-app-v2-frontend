import client from './axiosClient';
export const getPreferencesApi = () => client.get('/api/users/me/preferences');
export const saveNotificationPreferencesApi = data => client.put('/api/users/me/preferences/notifications', data);
export const saveDashboardPreferencesApi = data => client.put('/api/users/me/preferences/dashboard', data);
