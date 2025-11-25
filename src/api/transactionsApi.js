import axiosClient from './axiosClient';

export const getTransactionsApi = (accountId) => axiosClient.get(`/api/transaction/account/${accountId}`);
export const createTransactionApi = (transactionData) => axiosClient.post('/api/transaction', transactionData);
