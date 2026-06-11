import axios, { type InternalAxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios';
import { clearAuthSession, getAccessToken, getAccountType, getRefreshToken, refreshAccessToken } from '@/utils/authToken';
import { getApiBaseUrl } from '@/utils/apiConfig';

export { getApiBaseUrl };

const api = axios.create({
    baseURL: getApiBaseUrl(),
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 60000,
    timeoutErrorMessage: 'Request timed out. Please check your connection and try again.'
});

const isBlogAdminRoute = (url?: string) =>
    !!url &&
    (url.includes('/blogs') ||
        url.includes('/blog-admin') ||
        url.includes('/resources'));

let isRefreshing = false;
let refreshQueue: Array<{
    resolve: (token: string) => void;
    reject: (err: unknown) => void;
}> = [];

const drainRefreshQueue = (error: unknown | null, token: string | null = null) => {
    refreshQueue.forEach(({ resolve, reject }) => {
        if (error || !token) reject(error);
        else resolve(token);
    });
    refreshQueue = [];
};

// Add a request interceptor to include the auth token in all requests
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        if (config.data instanceof FormData && config.headers) {
            delete config.headers['Content-Type'];
        }

        if (config.headers && config.headers['x-auth-token']) {
            return config;
        }

        const token = isBlogAdminRoute(config.url)
            ? localStorage.getItem('blogAdminToken') || getAccessToken()
            : getAccessToken() || localStorage.getItem('blogAdminToken');

        if (token && config.headers) {
            config.headers['x-auth-token'] = token;
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError & { config?: InternalAxiosRequestConfig & { _retry?: boolean } }) => {
        if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
            console.error('Request timeout:', error.config?.url);
            return Promise.reject(new Error('Request timed out. Please check your connection.'));
        }

        if (!error.response) {
            console.error('Network error:', error.message || 'Unknown error');
            return Promise.reject(new Error('Network error. Please ensure the backend server is running and accessible.'));
        }

        const originalRequest = error.config;
        const isAuthRefresh = originalRequest?.url?.includes('/auth/refresh');
        const isLogin =
            originalRequest?.url?.includes('/auth/login') ||
            originalRequest?.url?.includes('/farmers/auth/login');
        const isGrowerAccount = getAccountType() === 'grower';

        if (
            error.response.status === 401 &&
            originalRequest &&
            !originalRequest._retry &&
            !isAuthRefresh &&
            !isLogin &&
            !isGrowerAccount &&
            getRefreshToken()
        ) {
            if (isRefreshing) {
                return new Promise<string>((resolve, reject) => {
                    refreshQueue.push({ resolve, reject });
                }).then((newToken) => {
                    if (originalRequest.headers) {
                        originalRequest.headers['x-auth-token'] = newToken;
                    }
                    return api(originalRequest);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const newToken = await refreshAccessToken();
                drainRefreshQueue(null, newToken);
                if (originalRequest.headers) {
                    originalRequest.headers['x-auth-token'] = newToken;
                }
                return api(originalRequest);
            } catch (refreshErr) {
                drainRefreshQueue(refreshErr, null);
                clearAuthSession();
                if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/agent/login')) {
                    window.location.href = '/login';
                }
                return Promise.reject(refreshErr);
            } finally {
                isRefreshing = false;
            }
        }

        if (error.response.status === 401 && isAuthRefresh) {
            clearAuthSession();
        }

        return Promise.reject(error);
    }
);

export default api;
