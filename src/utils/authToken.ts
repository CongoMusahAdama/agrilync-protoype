import axios from 'axios';
import { getApiBaseUrl } from '@/utils/apiConfig';

const REFRESH_KEY = 'refreshToken';
const ACCESS_KEY = 'token';
const GROWER_TOKEN_KEY = 'growerToken';
const GROWER_PROFILE_KEY = 'growerProfile';
const ACCOUNT_TYPE_KEY = 'accountType';

export interface GrowerProfile {
    id: string;
    lyncId?: string;
    name: string;
    status: 'active' | 'pending' | 'inactive';
    region?: string;
    district?: string;
    community?: string;
    contact?: string;
    email?: string;
    profilePicture?: string;
}

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

export const persistGrowerSession = (accessToken: string, farmer: GrowerProfile) => {
    localStorage.setItem(GROWER_TOKEN_KEY, accessToken);
    localStorage.setItem(GROWER_PROFILE_KEY, JSON.stringify(farmer));
    localStorage.setItem(ACCOUNT_TYPE_KEY, 'grower');
    localStorage.setItem(ACCESS_KEY, accessToken);
    localStorage.removeItem(REFRESH_KEY);
};

export const getGrowerToken = () => {
    try {
        return localStorage.getItem(GROWER_TOKEN_KEY);
    } catch {
        return null;
    }
};

export const getGrowerProfile = (): GrowerProfile | null => {
    try {
        const raw = localStorage.getItem(GROWER_PROFILE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

export const getAccountType = () => {
    try {
        return localStorage.getItem(ACCOUNT_TYPE_KEY);
    } catch {
        return null;
    }
};

export const clearAuthSession = () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(GROWER_TOKEN_KEY);
    localStorage.removeItem(GROWER_PROFILE_KEY);
    localStorage.removeItem(ACCOUNT_TYPE_KEY);
    localStorage.removeItem('blogAdminToken');
    localStorage.removeItem('blogAdminUser');
    localStorage.removeItem('agentProfile');
    localStorage.removeItem('offlineCredentialHash');
    localStorage.removeItem('offlineCredentialEmail');
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
