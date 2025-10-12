import axios from "axios";

// Check if we're in a Vercel environment
const isVercel = window.location.hostname.includes('vercel') || window.location.hostname.includes('xalora-client');
console.log(`🌐 AXIOS: Running in Vercel environment: ${isVercel}`);
console.log(`🌐 AXIOS: Window location: ${window.location.hostname}`);

const baseURL = import.meta.env.VITE_API_URL || "";
console.log(`🌐 AXIOS: Using baseURL: ${baseURL}`);

const compilerURL =
    import.meta.env.VITE_COMPILER_URL || "http://localhost:3001";

const axiosInstance = axios.create({
    baseURL,
    withCredentials: true,
    timeout: 10000, // 10 second timeout
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
        if (baseURL && (baseURL.includes('vercel') || baseURL.includes('https') || isVercel)) {
            config.headers['Cache-Control'] = 'no-cache';
            config.headers['Pragma'] = 'no-cache';
            config.headers['Expires'] = '0';
        }
        
        console.log(`📡 AXIOS-REQUEST: ${config.method?.toUpperCase()} ${config.url}`);
        console.log(`🌐 AXIOS-REQUEST: Using baseURL: ${baseURL}`);
        console.log(`🌐 AXIOS-REQUEST: Vercel environment: ${isVercel}`);
        console.log(`🍪 AXIOS-COOKIES: Sending credentials: ${config.withCredentials}`);
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
        
        // Log response errors
        console.log(`❌ AXIOS-RESPONSE-ERROR: ${error.response?.status} for ${originalRequest?.url}`);
        if (error.response?.status === 401) {
            console.log(`🍪 AXIOS-RESPONSE-COOKIES: Document cookies:`, document.cookie);
        }
        
        // Handle 401 errors globally
        if (error.response?.status === 401 && !originalRequest._retry) {
            console.log("🚪 AXIOS: 401 error detected");
            
            if (isRefreshing) {
                console.log("⏳ AXIOS: Token refresh in progress, queuing request");
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
                console.log("🔄 AXIOS: Attempting to refresh token");
                console.log(`🌐 AXIOS: Using refresh URL: ${baseURL}/api/v1/users/refresh-token`);
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
                    console.log("✅ AXIOS: Token refreshed successfully");
                    processQueue(null, refreshResponse.data.data?.accessToken);
                    // Update the Authorization header for the original request
                    if (refreshResponse.data.data?.accessToken) {
                        originalRequest.headers['Authorization'] = 'Bearer ' + refreshResponse.data.data.accessToken;
                    }
                    // Retry the original request
                    return axiosInstance(originalRequest);
                }
            } catch (refreshError) {
                console.log("❌ AXIOS: Token refresh failed:", refreshError.response?.data?.message);
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
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;