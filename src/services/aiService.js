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
        // Handle subscription errors
        if (error.response?.data?.redirectToPricing) {
            throw error;
        }
        throw error;
    }
};

export default {
    reviewCode,
};