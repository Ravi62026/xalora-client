// Utility functions for handling authentication
import authService from '../services/authService';

// Function to refresh token
export const refreshToken = async () => {
    try {
        console.log('🔄 AUTH-MIDDLEWARE: Attempting to refresh token');
        const response = await authService.refreshToken();
        if (response.success) {
            console.log('✅ AUTH-MIDDLEWARE: Token refreshed successfully');
            return response.data;
        }
        throw new Error('Token refresh failed');
    } catch (error) {
        console.log('❌ AUTH-MIDDLEWARE: Token refresh error:', error.response?.data?.message || error.message);
        throw error;
    }
};

// Function to check if user is authenticated
export const isAuthenticated = () => {
    // Check if we have user data in localStorage
    const storedUser = localStorage.getItem('hireveu_user');
    return !!storedUser;
};

// Function to get current user data
export const getCurrentUser = () => {
    try {
        const storedUser = localStorage.getItem('hireveu_user');
        return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
        console.log('❌ AUTH-MIDDLEWARE: Error parsing user data:', error);
        return null;
    }
};

// Function to clear authentication data
export const clearAuthData = () => {
    localStorage.removeItem('hireveu_user');
};

export default {
    refreshToken,
    isAuthenticated,
    getCurrentUser,
    clearAuthData
};