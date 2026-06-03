import axios, { type InternalAxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios';

/** Resolve API base URL — production builds MUST set VITE_API_URL at build time. */
export function getApiBaseUrl(): string {
    const envUrl = import.meta.env.VITE_API_URL?.trim();
    if (envUrl) return envUrl.replace(/\/$/, '');
    if (import.meta.env.DEV) return '/api';
    console.error(
        '[AgriLync] VITE_API_URL is not set. Blog/resource publishing will fail in production.'
    );
    return 'http://127.0.0.1:5000/api';
}

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

// Add a request interceptor to include the auth token in all requests
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // FormData uploads must not use application/json (needs multipart boundary)
        if (config.data instanceof FormData && config.headers) {
            delete config.headers['Content-Type'];
        }

        // Do not override if a specific token was already provided in the request
        if (config.headers && config.headers['x-auth-token']) {
            return config;
        }

        const token = isBlogAdminRoute(config.url)
            ? localStorage.getItem('blogAdminToken') || localStorage.getItem('token')
            : localStorage.getItem('token') || localStorage.getItem('blogAdminToken');

        if (token && config.headers) {
            config.headers['x-auth-token'] = token;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: any) => {
        // Handle timeout errors specifically
        if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
            console.error('Request timeout:', error.config?.url);
            return Promise.reject(new Error('Request timed out. Please check your connection.'));
        }

        // Handle network errors
        if (!error.response) {
            console.error('Network error:', error.message || 'Unknown error');
            return Promise.reject(new Error('Network error. Please ensure the backend server is running and accessible.'));
        }

        // Handle authentication errors
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('blogAdminToken');
            localStorage.removeItem('blogAdminUser');
        }

        return Promise.reject(error);
    }
);

export default api;
