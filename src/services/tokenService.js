// Refresh tokens are now stored in HTTP-only cookies for security.
// Access tokens can remain in memory or localStorage.

const ACCESS_KEY = 'app_access_token';
export const getLocalAccessToken = () => localStorage.getItem(ACCESS_KEY);
export const setLocalAccessToken = token => token ? localStorage.setItem(ACCESS_KEY, token) : localStorage.removeItem(ACCESS_KEY);
export const clearTokens = () => {
  localStorage.removeItem(ACCESS_KEY);
  // Refresh token is cleared by backend via cookie deletion
};
