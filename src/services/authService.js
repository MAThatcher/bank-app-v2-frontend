import { loginApi, logoutApi } from '../api/authApi';
import { setLocalAccessToken, clearTokens } from './tokenService';
import { clearImpersonation } from './impersonationService';
export const login = async credentials => {
  const res = await loginApi(credentials);
  const {
    accessToken,
    user
  } = res.data;
  setLocalAccessToken(accessToken);
  // Refresh token is automatically stored in HTTP-only cookie by backend
  return {
    user
  };
};
export const logout = async () => {
  try {
    await logoutApi({ skipImpersonation: true });
  } catch (err) {
    // ignore network errors on logout
  }
  clearTokens();
  clearImpersonation();
  window.dispatchEvent(new Event('session-ended'));
};
