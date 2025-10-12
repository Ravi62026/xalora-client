import ApiRoutes from "../routes/routes";
import axios from "../utils/axios";

const reviewCode = async (code, language, executionResult = null) => {
    try {
        const response = await axios.post(ApiRoutes.ai.reviewCode, {
            code,
            language,
            executionResult
        });
        return response.data;
    } catch (error) {
        console.log("❌ AI SERVICE - Error in reviewCode:", {
            message: error.message,
            status: error.response?.status,
            statusText: error.response?.statusText,
            responseData: error.response?.data
        });
        
        // Handle subscription errors
        if (error.response?.data?.redirectToPricing) {
            throw error;
        }
        
        // Handle authentication errors
        if (error.response?.status === 403) {
            throw new Error("Authentication required for AI code review. Please log in and try again.");
        }
        
        // Handle server errors
        if (error.response?.status === 500) {
            throw new Error("Server error while processing AI code review. Please try again later.");
        }
        
        throw error;
    }
};

export default {
    reviewCode,
};