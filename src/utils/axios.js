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
            
            // Try to refresh token
            if (!originalRequest._retry) {
                originalRequest._retry = true;
                
                try {
                    console.log("🔄 AXIOS: Attempting to refresh token");
                    const refreshResponse = await axios.post(
                        `${baseURL}/api/v1/users/refresh-token`,
                        {},
                        { withCredentials: true }
                    );
                    
                    if (refreshResponse.data.success) {
                        console.log("✅ AXIOS: Token refreshed successfully");
                        // Retry the original request
                        return axiosInstance(originalRequest);
                    }
                } catch (refreshError) {
                    console.log("❌ AXIOS: Token refresh failed:", refreshError.response?.data?.message);
                }
            }
            
            // If refresh failed or not attempted, clear localStorage and logout
            console.log("🚪 AXIOS: Clearing localStorage and logging out");
            localStorage.removeItem('hireveu_user');
            
            // Dispatch logout action if store is available
            if (window.__REDUX_STORE__) {
                // Use the action type directly since we can't import dynamically here
                window.__REDUX_STORE__.dispatch({ type: 'user/forceLogout' });
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