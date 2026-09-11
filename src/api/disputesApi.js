import client from './axiosClient';
export const getDisputesApi = params => client.get('/api/transaction/disputes', { params });
export const getDisputeApi = id => client.get(`/api/transaction/disputes/${id}`);
export const createDisputeApi = (id, data) => client.post(`/api/transaction/dispute/${id}`, data);
export const updateDisputeApi = (id, data) => client.patch(`/api/transaction/disputes/${id}`, data);
