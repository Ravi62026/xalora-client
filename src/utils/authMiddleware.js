import authService from "../services/authService";

export const refreshToken = async () => {
  const response = await authService.refreshToken();
  if (!response.success) {
    throw new Error(response.message || "Token refresh failed");
  }
  return response.data;
};

export const isAuthenticated = () => false;

export const getCurrentUser = () => null;

export const clearAuthData = () => {};

export default {
  refreshToken,
  isAuthenticated,
  getCurrentUser,
  clearAuthData,
};
