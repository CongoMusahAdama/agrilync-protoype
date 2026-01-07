import axios from 'axios';
import { getMockResponse, isLocalhost } from './mockData';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api',
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 30000, // 30 second timeout for mobile/slow connections
    timeoutErrorMessage: 'Request timed out. Please check your connection and try again.'
});

// Add a request interceptor to include the auth token in all requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['x-auth-token'] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // On localhost, if backend is not available, return mock data
        if (isLocalhost() && (!error.response || error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK')) {
            const mockResponse = getMockResponse(error.config?.url || '', error.config?.method || 'GET');
            if (mockResponse) {
                console.log('[MOCK] Returning mock data for:', error.config?.url);
                // Return a successful response with mock data
                return Promise.resolve({
                    ...error.config,
                    data: mockResponse.data,
                    status: 200,
                    statusText: 'OK',
                    headers: {},
                    config: error.config,
                });
            }
        }

        // Handle timeout errors specifically
        if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
            console.error('Request timeout:', error.config?.url);
            return Promise.reject(new Error('Request timed out. Please check your connection.'));
        }
        
        // Handle network errors
        if (!error.response) {
            console.error('Network error:', error.message);
            // On localhost, try to return mock data one more time
            if (isLocalhost()) {
                const mockResponse = getMockResponse(error.config?.url || '', error.config?.method || 'GET');
                if (mockResponse) {
                    console.log('[MOCK] Returning mock data for network error:', error.config?.url);
                    return Promise.resolve({
                        ...error.config,
                        data: mockResponse.data,
                        status: 200,
                        statusText: 'OK',
                        headers: {},
                        config: error.config,
                    });
                }
            }
            return Promise.reject(new Error('Network error. Please check your internet connection.'));
        }
        
        return Promise.reject(error);
    }
);

export default api;
