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
    withCredentials: true,
    timeout: 120000, // 120 second timeout (2 minutes) for long operations like resume analysis
});

// Add request interceptor to ensure credentials are sent
axiosInstance.interceptors.request.use(
    (config) => {
        config.withCredentials = true;
        // Ensure proper headers for cookie handling
        if (!config.headers) {
            config.headers = {};
        }
        
        // Add additional headers for cross-origin requests
        if (baseURL && (baseURL.includes('vercel') || baseURL.includes('https') || isVercel || isCustomDomain)) {
            config.headers['Cache-Control'] = 'no-cache';
            config.headers['Pragma'] = 'no-cache';
            config.headers['Expires'] = '0';
        }
        
        // Always include credentials and proper headers
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

// Keep track of refreshing state to prevent multiple concurrent refresh requests
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    
    failedQueue = [];
};

// Add response interceptor to handle 401 errors globally
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        
        // Handle 401 errors globally
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise(function(resolve, reject) {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    return axiosInstance(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }
            
            originalRequest._retry = true;
            isRefreshing = true;
            
            try {
                const refreshResponse = await axios.post(
                    `${baseURL}/api/v1/users/refresh-token`,
                    {},
                    { 
                        withCredentials: true,
                        // Ensure proper headers for cookie handling
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );
                
                if (refreshResponse.data.success) {
                    processQueue(null, refreshResponse.data.data?.accessToken);
                    // Update the Authorization header for the original request
                    if (refreshResponse.data.data?.accessToken) {
                        originalRequest.headers['Authorization'] = 'Bearer ' + refreshResponse.data.data.accessToken;
                    }
                    // Retry the original request
                    return axiosInstance(originalRequest);
                }
            } catch (refreshError) {
                processQueue(refreshError, null);
                // Clear localStorage and logout
                localStorage.removeItem('hireveu_user');
                
                // Dispatch logout action if store is available
                if (window.__REDUX_STORE__) {
                    // Use the action type directly since we can't import dynamically here
                    window.__REDUX_STORE__.dispatch({ type: 'user/forceLogout' });
                }
                
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
        
        // Handle 403 errors for AI service
        if (error.response?.status === 403 && originalRequest.url?.includes('/ai/review-code')) {
            // Try to refresh token and retry once
            if (!originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    const refreshResponse = await axios.post(
                        `${baseURL}/api/v1/users/refresh-token`,
                        {},
                        { withCredentials: true }
                    );

                    if (refreshResponse.data.success) {
                        return axiosInstance(originalRequest);
                    }
                } catch (refreshError) {
                    // Token refresh failed, continue with rejection
                }
            }
        }
        
        return Promise.reject(error);
    }
);

export const compilerAxios = axios.create({
    baseURL: compilerURL,
    withCredentials: true,
    timeout: 30000, // 30 second timeout for compiler
});

// Add request interceptor to ensure credentials are sent
compilerAxios.interceptors.request.use(
    (config) => {
        config.withCredentials = true;
        // Ensure proper headers for cookie handling
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