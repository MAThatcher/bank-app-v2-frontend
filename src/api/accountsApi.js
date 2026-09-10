import axiosClient from './axiosClient';

export const getAccountsApi = () => axiosClient.get('/api/account');
export const getAccountByIdApi = (accountId) => axiosClient.get(`/api/account/${accountId}`);
export const createAccountApi = (accountData) => axiosClient.post('/api/account', accountData);
export const deleteAccountApi = (accountId, confirmation) => axiosClient.delete(`/api/account/${accountId}`, { data: confirmation });
export const getVaultSettingsApi = accountId => axiosClient.get(`/api/account/${accountId}/settings`);

export const addUserToAccountApi = (accountId, userData) => axiosClient.post(`/api/account/${accountId}/users`, userData);
export const removeUserFromAccountApi = (accountId, userData) => axiosClient.delete(`/api/account/${accountId}/users`, { data: userData });

export const transferOwnershipApi = (accountId, ownershipData) => axiosClient.patch(`/api/account/${accountId}/transfer-ownership`, ownershipData);
export const changeOverdraftApi = (accountId, overdraftData) => axiosClient.patch(`/api/account/${accountId}/overdraft`, overdraftData);
export const updateAccountDetailsApi = (accountId, accountData) => axiosClient.patch(`/api/account/${accountId}`, accountData);
export const getAccountBalanceApi = (accountId) => axiosClient.get(`/api/account/${accountId}/balance`);
