import axios, { type InternalAxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios';

/**
 * API client with optimized error handling
 * Always fetches from database - no mock data fallback
 * Caching is handled by React Query, not at the axios level
 */
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api',
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 60000, // 60 second timeout for mobile/slow connections
    timeoutErrorMessage: 'Request timed out. Please check your connection and try again.'
});

// Add a request interceptor to include the auth token in all requests
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
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
        }

        return Promise.reject(error);
    }
);

export default api;
