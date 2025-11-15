import { loginApi, logoutApi } from '../api/authApi';
import { setLocalAccessToken, setLocalRefreshToken, clearTokens } from './tokenService';


export const login = async (credentials) => {
    const res = await loginApi(credentials);
    const { accessToken, refreshToken, user } = res.data;
    setLocalAccessToken(accessToken);
    setLocalRefreshToken(refreshToken);
    return { user };
};


export const logout = async () => {
    try {
        await logoutApi();
    } catch (err) {
        // ignore network errors on logout
    }
    clearTokens();
};