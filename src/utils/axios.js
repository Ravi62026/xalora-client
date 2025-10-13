import axios from "axios";

// Check if we're in a Vercel environment or custom domain
const isVercel = window.location.hostname.includes('vercel') || window.location.hostname.includes('xalora-client');
const isCustomDomain = window.location.hostname.includes('xalora.one');
// const isLocalhost = window.location.hostname.includes('localhost') || window.location.hostname.includes('127.0.0.1');

// Determine the correct baseURL based on environment
let baseURL = import.meta.env.VITE_API_URL || "";

// If no baseURL is set and we're in production, use the deployed backend
if (!baseURL && (isVercel || isCustomDomain || import.meta.env.MODE === 'production')) {
    if (isCustomDomain) {
        // Use the deployed Cloud Run backend URL
        baseURL = "https://hireveu-server-758139154845.asia-south1.run.app";
    } else {
        baseURL = "";
    }
} else if (!baseURL) {
    // Default to localhost for development
    baseURL = "http://localhost:8000";
}

const compilerURL =
    import.meta.env.VITE_COMPILER_URL || "http://localhost:3001";

const axiosInstance = axios.create({
    baseURL,
    timeout: 120000, // 120 second timeout (2 minutes) for long operations like resume analysis
});

// Add request interceptor to add JWT token from localStorage
axiosInstance.interceptors.request.use(
    (config) => {
        // Get token from localStorage
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        // Ensure proper headers
        if (!config.headers) {
            config.headers = {};
        }

        // Don't set Content-Type for FormData - browser will set it automatically with boundary
        if (!(config.data instanceof FormData)) {
            if (!config.headers['Content-Type']) {
                config.headers['Content-Type'] = 'application/json';
            }
        }
        config.headers['Accept'] = 'application/json';

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle 401 errors
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle 401 errors by clearing localStorage and redirecting to login
        if (error.response?.status === 401) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('hireveu_user');

            // Dispatch logout action if store is available
            if (window.__REDUX_STORE__) {
                window.__REDUX_STORE__.dispatch({ type: 'user/forceLogout' });
            }

            // Redirect to login page if not already there
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export const compilerAxios = axios.create({
    baseURL: compilerURL,
    timeout: 30000, // 30 second timeout for compiler
});

// Add request interceptor for compiler axios
compilerAxios.interceptors.request.use(
    (config) => {
        // Ensure proper headers
        if (!config.headers) {
            config.headers = {};
        }
        config.headers['Content-Type'] = 'application/json';
        config.headers['Accept'] = 'application/json';
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;