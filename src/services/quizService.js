import axios from "../utils/axios";
import ApiRoutes from "../routes/routes";

const quizService = {
    // Get all quizzes
    getAllQuizzes: async () => {
        const response = await axios.get(ApiRoutes.quizzes.getAll);
        return response.data;
    },

    // Get quiz by ID
    getQuizById: async (id) => {
        const response = await axios.get(ApiRoutes.quizzes.getById(id));
        return response.data;
    },

    // Submit quiz
    submitQuiz: async (quizData) => {
        const response = await axios.post(ApiRoutes.quizzes.submit, quizData);
        return response.data;
    },

    // Get user's quiz submissions
    getUserSubmissions: async () => {
        const response = await axios.get(ApiRoutes.quizzes.getUserSubmissions);
        return response.data;
    },

    // Get quiz analytics
    getAnalytics: async () => {
        const response = await axios.get(ApiRoutes.quizzes.analytics);
        return response.data;
    },

    // Get quiz report
    getReport: async (submissionId) => {
        const response = await axios.get(ApiRoutes.quizzes.getReport(submissionId));
        return response.data;
    },

    // Download quiz PDF
    downloadPDF: async (submissionId) => {
        const response = await axios.get(ApiRoutes.quizzes.downloadPDF(submissionId), {
            responseType: 'blob'
        });
        return response.data;
    },

    // Download quiz certificate
    downloadCertificate: async (submissionId) => {
        const response = await axios.get(ApiRoutes.quizzes.downloadCertificate(submissionId), {
            responseType: 'blob'
        });
        return response.data;
    }
};

export default quizService;