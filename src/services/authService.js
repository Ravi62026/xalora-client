import axiosInstance from "../utils/axios";
import ApiRoutes from "../routes/routes";

const authService = {
    login: async (email, password) => {
         console.log("🔐 AUTH-SERVICE: Attempting login with email:", email);
         const response = await axiosInstance.post(ApiRoutes.auth.login, {
            email,
            password,
        });
        console.log("✅ AUTH-SERVICE: Login response received");
        console.log("🍪 AUTH-SERVICE: Response headers:", response.headers);
        console.log("🍪 AUTH-SERVICE: Document cookies after login request:", document.cookie);
        return response.data;
    },
    register: async (email, password, name, username) => {
        const response = await axiosInstance.post(ApiRoutes.auth.register, {
            name,
            username,
            email,
            password,
        });
        return response.data;
    },
    logout: async () => {
        console.log("🚪 AUTH-SERVICE: Attempting logout");
        const response = await axiosInstance.post(ApiRoutes.auth.logout);
        console.log("✅ AUTH-SERVICE: Logout response received");
        return response.data;
    },
    getUser: async () => {
        console.log("🔍 AUTH-SERVICE: Getting user data...");
        console.log("🍪 AUTH-SERVICE: Current document cookies:", document.cookie);
        try {
            const response = await axiosInstance.get(ApiRoutes.user.getUser);
            console.log("✅ AUTH-SERVICE: User data received:", response.data);
            console.log("✅ AUTH-SERVICE: User object:", response.data.data);
            return response.data;
        } catch (error) {
            console.log("❌ AUTH-SERVICE: Failed to get user:", error.response?.status, error.response?.data?.message);
            throw error;
        }
    },
    checkAuth: async () => {
        console.log("🔍 AUTH-DEBUG: Checking authentication status...");
        try {
            const response = await axiosInstance.get(ApiRoutes.user.checkAuth || "/api/v1/users/check-auth");
            console.log("✅ AUTH-DEBUG: Response received:", response.data);
            return response.data;
        } catch (error) {
            console.log("❌ AUTH-DEBUG: Error checking auth:", error.response?.data || error.message);
            throw error;
        }
    },
    updateUser: async (name, username, email, avatar) => {
        const response = await axiosInstance.put(ApiRoutes.user.updateUser, {
            name,
            username,
            email,
            avatar, 
        });
        return response.data;
    },
    refreshToken: async () => {
        console.log("🔄 AUTH-SERVICE: Refreshing token...");
        console.log("🍪 AUTH-SERVICE: Current document cookies before refresh:", document.cookie);
        try {
            const response = await axiosInstance.post(ApiRoutes.user.refreshToken);
            console.log("✅ AUTH-SERVICE: Token refreshed:", response.data);
            console.log("🍪 AUTH-SERVICE: Document cookies after refresh:", document.cookie);
            return response.data;
        } catch (error) {
            console.log("❌ AUTH-SERVICE: Failed to refresh token:", error.response?.data?.message);
            throw error;
        }
    },
};

export default authService;