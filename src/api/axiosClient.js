import axios from 'axios';
import { getImpersonation } from '../services/impersonationService';
import { getLocalAccessToken, setLocalAccessToken, clearTokens } from '../services/tokenService';
const API_BASE = (process.env.REACT_APP_API_BASE || 'http://localhost:5000').replace(/\/+$/, '') + '/';
const axiosClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});
let isRefreshing = false;
let failedQueue = [];
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);else prom.resolve(token);
  });
  failedQueue = [];
};
axiosClient.interceptors.request.use(config => {
  const token = getLocalAccessToken();
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  const context = getImpersonation();
  if (context && !config.skipImpersonation) config.headers['X-Impersonation-Id'] = context.id;
  else delete config.headers['X-Impersonation-Id'];
  // TODO: add a requestId for tracing
  config.headers['X-Request-Id'] = `req-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return config;
}, error => Promise.reject(error));
axiosClient.interceptors.response.use(response => response, async error => {
  const originalRequest = error.config;
  if (!originalRequest) return Promise.reject(error);
  if (error.response?.data?.code?.startsWith('IMPERSONATION_')) {
    if (error.response.data.code === 'IMPERSONATION_INVALID') window.dispatchEvent(new Event('impersonation-invalid'));
    return Promise.reject(error);
  }

  // If 401 or 403 (expired/invalid token) and not retrying:
  // Don't try to refresh if this IS the refresh endpoint failing
  const isAuthError = error.response && (error.response.status === 401 || error.response.status === 403);
  const isRefreshEndpoint = /\/auth\/(refresh|login|forgot-password|reset-password)/.test(originalRequest.url || '');
  if (isAuthError && !originalRequest._retry && !isRefreshEndpoint) {
    if (isRefreshing) {
      return new Promise(function (resolve, reject) {
        failedQueue.push({
          resolve,
          reject
        });
      }).then(token => {
        originalRequest.headers['Authorization'] = 'Bearer ' + token;
        return axiosClient(originalRequest);
      }).catch(err => Promise.reject(err));
    }
    originalRequest._retry = true;
    isRefreshing = true;
    try {
      // Refresh token is automatically sent via HTTP-only cookie
      const response = await axios.post(`${API_BASE}api/auth/refresh`, {}, {
        withCredentials: true,
        baseURL: '' // Override baseURL to avoid double processing
      });
      const {
        accessToken
      } = response.data;
      setLocalAccessToken(accessToken);
      axiosClient.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;
      processQueue(null, accessToken);
      return axiosClient(originalRequest);
    } catch (err) {
      processQueue(err, null);
      if ([401, 403].includes(err.response?.status)) {
        clearTokens();
        delete axiosClient.defaults.headers.common['Authorization'];
        window.dispatchEvent(new Event('session-ended'));
      }
      // Redirect to login or handle logout
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
  return Promise.reject(error);
});
export default axiosClient;
