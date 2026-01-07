import axios from 'axios';

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
        // Handle timeout errors specifically
        if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
            console.error('Request timeout:', error.config?.url);
            return Promise.reject(new Error('Request timed out. Please check your connection.'));
        }
        
        // Handle network errors
        if (!error.response) {
            console.error('Network error:', error.message);
            return Promise.reject(new Error('Network error. Please check your internet connection.'));
        }
        
        return Promise.reject(error);
    }
);

export default api;
