import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "";
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
                const refreshResponse = await axios.post(
                    `${baseURL}/api/v1/users/refresh-token`,
                    {},
                    { withCredentials: true }
                );
                
                if (refreshResponse.data.success) {
                    console.log("✅ AXIOS: Token refreshed successfully");
                    processQueue(null, refreshResponse.data.data.accessToken);
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
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;