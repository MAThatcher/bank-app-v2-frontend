// NOTE: for banking apps prefer httpOnly secure cookies for refresh tokens.
// This example uses localStorage for simplicity. Swap to cookies on production.


const ACCESS_KEY = 'app_access_token';
const REFRESH_KEY = 'app_refresh_token';


export const getLocalAccessToken = () => localStorage.getItem(ACCESS_KEY);
export const setLocalAccessToken = (token) => token ? localStorage.setItem(ACCESS_KEY, token) : localStorage.removeItem(ACCESS_KEY);


export const getLocalRefreshToken = () => localStorage.getItem(REFRESH_KEY);
export const setLocalRefreshToken = (token) => token ? localStorage.setItem(REFRESH_KEY, token) : localStorage.removeItem(REFRESH_KEY);


export const clearTokens = () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
};