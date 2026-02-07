import axiosInstance from "../utils/axios";
import ApiRoutes from "../routes/routes";

const authService = {
  login: async (email, password) => {
    const response = await axiosInstance.post(ApiRoutes.auth.login, {
      email,
      password,
    });
    return response.data;
  },

  googleLogin: async (tokenId) => {
    const response = await axiosInstance.post(ApiRoutes.auth.googleLogin, {
      tokenId,
    });
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
    const response = await axiosInstance.post(ApiRoutes.auth.logout);
    return response.data;
  },

  getUser: async () => {
    const response = await axiosInstance.get(ApiRoutes.user.getUser);
    return response.data;
  },

  checkAuth: async () => {
    const response = await axiosInstance.get(
      ApiRoutes.user.checkAuth || "/api/v1/users/check-auth"
    );
    return response.data;
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
    const response = await axiosInstance.post(ApiRoutes.user.refreshToken);
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await axiosInstance.post(ApiRoutes.auth.forgotPassword, {
      email,
    });
    return response.data;
  },

  resetPassword: async (token, password) => {
    const response = await axiosInstance.post(ApiRoutes.auth.resetPassword, {
      token,
      password,
    });
    return response.data;
  },
};

export default authService;
