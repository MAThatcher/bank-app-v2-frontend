import client from './axiosClient';
export const getAdminOverviewApi = () => client.get('/api/admin/overview');
export const getAdminUsersApi = params => client.get('/api/admin/users', { params });
export const getAdminVaultsApi = params => client.get('/api/admin/vaults', { params });
export const getAdminAuditApi = params => client.get('/api/admin/audit', { params });
export const changeAdminRoleApi = (id, data) => client.patch(`/api/admin/users/${id}/role`, data);
export const revokeAdminSessionsApi = (id, data) => client.post(`/api/admin/users/${id}/revoke-sessions`, data);
export const startImpersonationApi = (id, data) => client.post(`/api/admin/users/${id}/impersonate`, data);
export const stopImpersonationApi = id => client.delete(`/api/impersonation/${id}`, { skipImpersonation: true });
