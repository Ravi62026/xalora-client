import axios, { compilerAxios } from "../utils/axios";
import ApiRoutes from "../routes/routes";

const API_URL = "/api/v1/problems";

const problemService = {
    createProblem: async (problemData) => {
        const response = await axios.post(API_URL, problemData);
        return response.data;
    },

    getAllProblems: async (params = {}) => {
        const response = await axios.get(ApiRoutes.problems.getAll, { params });
        return response.data;
    },

    getMyProblems: async () => {
        const response = await axios.get(ApiRoutes.problems.getMy);
        return response.data;
    },

    getProblemById: async (id) => {
        const response = await axios.get(ApiRoutes.problems.getById(id));
        return response.data;
    },

    updateProblem: async (id, problemData) => {
        const response = await axios.put(
            ApiRoutes.problems.update(id),
            problemData
        );
        return response.data;
    },

    deleteProblem: async (id) => {
        const response = await axios.delete(ApiRoutes.problems.delete(id));
        return response.data;
    },

    executeCode: async (code, language, input = "") => {
        const response = await compilerAxios.post(ApiRoutes.problems.execute, {
            code,
            language,
            input,
        });
        return response.data;
    },

    submitSolution: async ({ problemId, code, language }) => {
        try {
            const response = await axios.post(
                ApiRoutes.problems.submit(problemId),
                {
                    code,
                    language,
                }
            );
            return response.data;
        } catch (error) {
            console.log("❌ PROBLEM SERVICE - Error in submitSolution:", {
                message: error.message,
                status: error.response?.status,
                statusText: error.response?.statusText,
                responseData: error.response?.data
            });
            
            // Handle authentication errors
            if (error.response?.status === 401) {
                throw new Error("Authentication required. Please log in and try again.");
            }
            
            // Handle server errors
            if (error.response?.status === 500) {
                throw new Error("Server error while submitting solution. Please try again later.");
            }
            
            // Re-throw the error for the calling function to handle
            throw error;
        }
    },

    getProblemSubmissions: async (problemId) => {
        try {
            const response = await axios.get(
                ApiRoutes.problems.getSubmissions(problemId)
            );
            return response.data;
        } catch (error) {
            // If user is not authenticated, return empty submissions array
            if (error.response && error.response.status === 401) {
                return { success: true, data: [], message: "User not authenticated" };
            }
            throw error;
        }
    },
};

export default problemService;