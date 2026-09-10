import axiosClient from './axiosClient';

export const getTransactionsApi = (accountId) => axiosClient.get(`/api/transaction/account/${accountId}`);
export const createTransactionApi = (transactionData) => axiosClient.post('/api/transaction', transactionData);
export const getTransferAccountsApi = () => axiosClient.get('/api/transaction/transfer-accounts');
export const createTransferApi = (transferData) => axiosClient.post('/api/transaction/transfer', transferData);
export const searchLedgerApi = params => axiosClient.get('/api/transaction/search', { params });
export const exportLedgerApi = params => axiosClient.get('/api/transaction/export', { params, responseType: 'blob' });
