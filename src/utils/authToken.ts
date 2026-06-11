import axios from 'axios';
import { getApiBaseUrl } from '@/utils/apiConfig';

const REFRESH_KEY = 'refreshToken';
const ACCESS_KEY = 'token';

export const getAccessToken = () => {
    try {
        return localStorage.getItem(ACCESS_KEY);
    } catch {
        return null;
    }
};

export const getRefreshToken = () => {
    try {
        return localStorage.getItem(REFRESH_KEY);
    } catch {
        return null;
    }
};

export const persistAuthSession = (accessToken: string, refreshToken?: string | null) => {
    localStorage.setItem(ACCESS_KEY, accessToken);
    if (refreshToken) {
        localStorage.setItem(REFRESH_KEY, refreshToken);
    }
};

export const clearAuthSession = () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem('blogAdminToken');
    localStorage.removeItem('blogAdminUser');
};

/** Exchange refresh token for a new access token (no api interceptor — avoids loops) */
export const refreshAccessToken = async (): Promise<string> => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
        throw new Error('No refresh token');
    }

    const res = await axios.post(
        `${getApiBaseUrl()}/auth/refresh`,
        { refreshToken },
        { timeout: 30000, headers: { 'Content-Type': 'application/json' } }
    );

    const newToken = res.data?.token;
    if (!newToken) {
        throw new Error('Refresh response missing token');
    }

    localStorage.setItem(ACCESS_KEY, newToken);
    return newToken;
};
