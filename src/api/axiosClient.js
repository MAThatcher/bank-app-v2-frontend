import axios from 'axios';
import { getLocalRefreshToken, getLocalAccessToken, setLocalAccessToken, clearTokens } from '../services/tokenService';


const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';


const axiosClient = axios.create({
    baseURL: API_BASE,
    headers: { 'Content-Type': 'application/json' },
});


let isRefreshing = false;
let failedQueue = [];


const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
};


axiosClient.interceptors.request.use(
    config => {
        const token = getLocalAccessToken();
        if (token) config.headers['Authorization'] = `Bearer ${token}`;
        // TODO: add a requestId for tracing
        config.headers['X-Request-Id'] = `req-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        return config;
    },
    error => Promise.reject(error)
);


axiosClient.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (!originalRequest) return Promise.reject(error);


        // If 401 and not retrying:
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                    .then(token => {
                        originalRequest.headers['Authorization'] = 'Bearer ' + token;
                        return axiosClient(originalRequest);
                    })
                    .catch(err => Promise.reject(err));
            }


            originalRequest._retry = true;
            isRefreshing = true;


            const refreshToken = getLocalRefreshToken();
            if (!refreshToken) {
                clearTokens();
                isRefreshing = false;
                return Promise.reject(error);
            }


            try {
                const response = await axios.post(`${API_BASE}/auth/refresh-token`, { refreshToken });
                const { accessToken } = response.data;
                setLocalAccessToken(accessToken);
                axiosClient.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;
                processQueue(null, accessToken);
                return axiosClient(originalRequest);
            } catch (err) {
                processQueue(err, null);
                clearTokens();
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }


        return Promise.reject(error);
    }
);


export default axiosClient;