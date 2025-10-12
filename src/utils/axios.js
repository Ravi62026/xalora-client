import axios from "axios";

// Check if we're in a Vercel environment or custom domain
const isVercel = window.location.hostname.includes('vercel') || window.location.hostname.includes('xalora-client');
const isCustomDomain = window.location.hostname.includes('xalora.one');
const isLocalhost = window.location.hostname.includes('localhost') || window.location.hostname.includes('127.0.0.1');

console.log(`🌐 AXIOS: Running in Vercel environment: ${isVercel}`);
console.log(`🌐 AXIOS: Running in Custom domain: ${isCustomDomain}`);
console.log(`🌐 AXIOS: Running in Localhost: ${isLocalhost}`);
console.log(`🌐 AXIOS: Window location: ${window.location.hostname}`);
console.log(`🌐 AXIOS: Window protocol: ${window.location.protocol}`);

// Determine the correct baseURL based on environment
let baseURL = import.meta.env.VITE_API_URL || "";
console.log(`🌐 AXIOS: Initial baseURL from env: ${baseURL}`);

// If no baseURL is set and we're in production, use relative path (same origin)
if (!baseURL && (isVercel || isCustomDomain || import.meta.env.MODE === 'production')) {
    // For custom domains, we need to determine the correct API URL
    if (isCustomDomain) {
        // Use the same protocol and domain but with API subdomain or same domain
        baseURL = `${window.location.protocol}//${window.location.hostname}:8000`;
        console.log(`🌐 AXIOS: Using custom domain API URL: ${baseURL}`);
    } else {
        baseURL = "";
        console.log(`🌐 AXIOS: Using relative path for production environment`);
    }
} else if (!baseURL) {
    // Default to localhost for development
    baseURL = "http://localhost:8000";
    console.log(`🌐 AXIOS: Using default localhost baseURL for development`);
}

console.log(`🌐 AXIOS: Final baseURL: ${baseURL}`);

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
        
        console.log(`📡 AXIOS-REQUEST: ${config.method?.toUpperCase()} ${config.url}`);
        console.log(`🌐 AXIOS-REQUEST: Using baseURL: ${baseURL}`);
        console.log(`🌐 AXIOS-REQUEST: Vercel environment: ${isVercel}, Custom domain: ${isCustomDomain}`);
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
        
        // Handle 403 errors for AI service
        if (error.response?.status === 403 && originalRequest.url?.includes('/ai/review-code')) {
            console.log("❌ AXIOS: 403 Forbidden on AI service - likely authentication issue");
            // Try to refresh token and retry once
            if (!originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    console.log("🔄 AXIOS: Attempting token refresh for AI service");
                    const refreshResponse = await axios.post(
                        `${baseURL}/api/v1/users/refresh-token`,
                        {},
                        { withCredentials: true }
                    );
                    
                    if (refreshResponse.data.success) {
                        console.log("✅ AXIOS: Token refreshed, retrying AI request");
                        return axiosInstance(originalRequest);
                    }
                } catch (refreshError) {
                    console.log("❌ AXIOS: Token refresh failed for AI service");
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