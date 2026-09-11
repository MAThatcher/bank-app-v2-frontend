import client from './axiosClient';
const path = type => type === 'category' ? 'categories' : 'tags';
export const getLedgerLabelsApi = async () => { const [categories,tags] = await Promise.all([client.get('/api/transaction/categories'),client.get('/api/transaction/tags')]); return {categories:categories.data,tags:tags.data}; };
export const saveLedgerLabelApi = (type,data,id) => id ? client.patch(`/api/transaction/${path(type)}/${id}`,data) : client.post(`/api/transaction/${path(type)}`,data);
export const archiveLedgerLabelApi = (type,id) => client.delete(`/api/transaction/${path(type)}/${id}`);
export const assignLedgerLabelsApi = data => client.patch('/api/transaction/bulk/labels',data);
