import axiosInstance from "../utils/axios";
import ApiRoutes from "../routes/routes";

// ============================================
// LOGGING UTILITIES FOR INTERVIEW SERVICE
// ============================================
const LOG_PREFIX = "🎯 [InterviewService]";

const log = {
    info: (method, message, data = null) => {
        console.log(`${LOG_PREFIX} [${method}] ℹ️ ${message}`, data ? data : "");
    },
    success: (method, message, data = null) => {
        console.log(`${LOG_PREFIX} [${method}] ✅ ${message}`, data ? data : "");
    },
    error: (method, message, error = null) => {
        console.error(`${LOG_PREFIX} [${method}] ❌ ${message}`, error ? error : "");
    },
    request: (method, endpoint, payload = null) => {
        console.log(`${LOG_PREFIX} [${method}] 📤 REQUEST to ${endpoint}`, payload ? { payload } : "");
    },
    response: (method, data) => {
        console.log(`${LOG_PREFIX} [${method}] 📥 RESPONSE:`, data);
    }
};

/**
 * Interview Service
 * Handles all API calls for the AI Interview system
 * Includes comprehensive logging for debugging
 */
const interviewService = {
    /**
     * Start a new interview session
     * @param {FormData} formData - Contains resumeFile and other candidate info
     */
    startInterview: async (formData) => {
        const method = "startInterview";
        log.info(method, "Starting new interview session...");
        log.request(method, ApiRoutes.interview.start, {
            candidateName: formData.get("candidateName"),
            position: formData.get("position"),
            companyType: formData.get("companyType"),
            hasResume: formData.has("resumeFile")
        });

        try {
            const response = await axiosInstance.post(
                ApiRoutes.interview.start,
                formData
            );
            log.success(method, "Interview started successfully", {
                sessionId: response.data?.data?.sessionId,
                hasResumeAnalysis: !!response.data?.data?.resumeAnalysis
            });
            log.response(method, response.data);
            return response.data;
        } catch (error) {
            log.error(method, "Failed to start interview", {
                status: error.response?.status,
                message: error.response?.data?.message || error.message
            });
            throw error;
        }
    },

    /**
     * Get the next question for the interview
     * @param {string} sessionId - The interview session ID
     * @param {string} roundType - The type of interview round
     * @param {number} maxQuestions - Maximum questions for this round (optional)
     */
    getQuestion: async (sessionId, roundType, maxQuestions) => {
        const method = "getQuestion";
        log.info(method, `Fetching question for round: ${roundType}`);
        log.request(method, ApiRoutes.interview.question, { sessionId, roundType, maxQuestions });

        try {
            const response = await axiosInstance.post(ApiRoutes.interview.question, {
                sessionId,
                roundType,
                maxQuestions,
            });

            const questionData = response.data?.data;
            log.success(method, "Question received", {
                questionNumber: questionData?.questionNumber,
                maxQuestions: questionData?.maxQuestions,
                roundComplete: questionData?.roundComplete,
                questionPreview: questionData?.question?.text?.substring(0, 50) + "..."
            });
            log.response(method, response.data);
            return response.data;
        } catch (error) {
            log.error(method, "Failed to get question", {
                status: error.response?.status,
                message: error.response?.data?.message || error.message,
                roundComplete: error.response?.data?.data?.roundComplete
            });
            throw error;
        }
    },

    /**
     * Submit an answer to a question
     * @param {string} sessionId - The interview session ID
     * @param {string} roundType - The type of interview round
     * @param {string} questionId - The question being answered
     * @param {string} answer - The candidate's answer
     * @param {number} timeRemaining - Time remaining in the round (seconds)
     */
    submitAnswer: async (sessionId, roundType, questionId, answer, timeRemaining = 300) => {
        const method = "submitAnswer";
        log.info(method, `Submitting answer for ${roundType}`);
        log.request(method, ApiRoutes.interview.answer, {
            sessionId,
            roundType,
            questionId,
            answerLength: answer?.length,
            answerPreview: answer?.substring(0, 100) + "...",
            timeRemaining
        });

        try {
            const response = await axiosInstance.post(ApiRoutes.interview.answer, {
                sessionId,
                roundType,
                questionId,
                answer,
                timeRemaining,
            });

            const data = response.data?.data;
            log.success(method, "Answer submitted and evaluated", {
                nextAction: data?.nextAction,
                hasFollowup: !!data?.followupQuestion,
                roundComplete: data?.roundComplete,
                score: data?.evaluation?.overallScore
            });
            log.response(method, response.data);
            return response.data;
        } catch (error) {
            log.error(method, "Failed to submit answer", {
                status: error.response?.status,
                message: error.response?.data?.message || error.message
            });
            throw error;
        }
    },

    /**
     * Submit an answer to a follow-up question
     * @param {string} sessionId - The interview session ID
     * @param {string} roundType - The type of interview round
     * @param {string} questionId - The original question ID
     * @param {string} followupId - The follow-up question ID
     * @param {string} answer - The candidate's answer
     * @param {number} timeRemaining - Time remaining in the round (seconds)
     */
    submitFollowupAnswer: async (sessionId, roundType, questionId, followupId, answer, timeRemaining = 300) => {
        const method = "submitFollowupAnswer";
        log.info(method, `Submitting follow-up answer for ${roundType}`);
        log.request(method, ApiRoutes.interview.followupAnswer, {
            sessionId,
            roundType,
            questionId,
            followupId,
            answerLength: answer?.length,
            timeRemaining
        });

        try {
            const response = await axiosInstance.post(ApiRoutes.interview.followupAnswer, {
                sessionId,
                roundType,
                questionId,
                followupId,
                answer,
                timeRemaining,
            });

            const data = response.data?.data;
            log.success(method, "Follow-up answer submitted", {
                nextAction: data?.nextAction,
                roundComplete: data?.roundComplete
            });
            log.response(method, response.data);
            return response.data;
        } catch (error) {
            log.error(method, "Failed to submit follow-up answer", {
                status: error.response?.status,
                message: error.response?.data?.message || error.message
            });
            throw error;
        }
    },

    /**
     * Generate the final interview report
     * @param {string} sessionId - The interview session ID
     */
    generateReport: async (sessionId) => {
        const method = "generateReport";
        log.info(method, "Generating final interview report...");
        log.request(method, ApiRoutes.interview.report, { sessionId });

        try {
            const response = await axiosInstance.post(ApiRoutes.interview.report, {
                sessionId,
            });

            const report = response.data?.data?.report;
            log.success(method, "Report generated successfully", {
                overallScore: report?.overallScore,
                hasRoundAnalysis: !!report?.roundAnalysis,
                hiringRecommendation: report?.hiringRecommendation
            });
            log.response(method, response.data);
            return response.data;
        } catch (error) {
            log.error(method, "Failed to generate report", {
                status: error.response?.status,
                message: error.response?.data?.message || error.message
            });
            throw error;
        }
    },

    /**
     * Get the current session status
     * @param {string} sessionId - The interview session ID
     */
    getSessionStatus: async (sessionId) => {
        const method = "getSessionStatus";
        log.info(method, `Getting status for session: ${sessionId}`);
        log.request(method, ApiRoutes.interview.status(sessionId));

        try {
            const response = await axiosInstance.get(
                ApiRoutes.interview.status(sessionId)
            );

            const data = response.data?.data;
            log.success(method, "Session status retrieved", {
                status: data?.status,
                currentRound: data?.currentRound,
                completedRounds: data?.completedRounds
            });
            return response.data;
        } catch (error) {
            log.error(method, "Failed to get session status", {
                status: error.response?.status,
                message: error.response?.data?.message || error.message
            });
            throw error;
        }
    },

    /**
     * Get user's interview history
     */
    getInterviewHistory: async () => {
        const method = "getInterviewHistory";
        log.info(method, "Fetching interview history...");

        try {
            const response = await axiosInstance.get(ApiRoutes.interview.history);
            log.success(method, "History retrieved", {
                count: response.data?.data?.interviews?.length || 0
            });
            return response.data;
        } catch (error) {
            log.error(method, "Failed to get history", error);
            throw error;
        }
    },

    /**
     * Get shared report by token (public, no auth)
     * @param {string} shareToken - The share token
     */
    getSharedReport: async (shareToken) => {
        const method = "getSharedReport";
        log.info(method, `Getting shared report: ${shareToken}`);

        try {
            const response = await axiosInstance.get(
                ApiRoutes.interview.shared(shareToken)
            );
            log.success(method, "Shared report retrieved");
            return response.data;
        } catch (error) {
            log.error(method, "Failed to get shared report", error);
            throw error;
        }
    },

    /**
     * Convert text to speech
     * @param {string} text - Text to convert to speech
     * @param {string} voice - Voice to use (e.g., 'en-US-Standard-D')
     */
    textToSpeech: async (text, voice = "en-US-Standard-D") => {
        const method = "textToSpeech";
        log.info(method, `Converting text to speech (${text?.length} chars)`);

        try {
            const response = await axiosInstance.post(
                ApiRoutes.interview.tts,
                { text, voice },
                { responseType: "blob" }
            );
            log.success(method, "TTS conversion complete", {
                blobSize: response.data?.size
            });
            return response.data;
        } catch (error) {
            log.error(method, "TTS failed", error);
            throw error;
        }
    },

    /**
     * Convert speech to text
     * @param {Blob} audioBlob - Audio blob to transcribe
     */
    speechToText: async (audioBlob) => {
        const method = "speechToText";
        log.info(method, `Converting speech to text (blob size: ${audioBlob?.size})`);

        try {
            const formData = new FormData();
            formData.append("audioFile", audioBlob, "audio.webm");

            const response = await axiosInstance.post(
                ApiRoutes.interview.stt,
                formData
            );
            log.success(method, "STT conversion complete", {
                transcriptLength: response.data?.data?.text?.length
            });
            return response.data;
        } catch (error) {
            log.error(method, "STT failed", error);
            throw error;
        }
    },

    /**
     * Complete a round and move to the next
     * @param {string} sessionId - The interview session ID  
     * @param {string} roundType - The round type being completed
     */
    completeRound: async (sessionId, roundType) => {
        const method = "completeRound";
        log.info(method, `Completing round: ${roundType}`);
        log.request(method, ApiRoutes.interview.completeRound, { sessionId, roundType });

        try {
            const response = await axiosInstance.post(ApiRoutes.interview.completeRound, {
                sessionId,
                roundType,
            });

            const data = response.data?.data;
            log.success(method, "Round completed", {
                completedRound: data?.completedRound,
                nextRound: data?.nextRound,
                isInterviewComplete: data?.isInterviewComplete
            });
            log.response(method, response.data);
            return response.data;
        } catch (error) {
            log.error(method, "Failed to complete round", {
                status: error.response?.status,
                message: error.response?.data?.message || error.message
            });
            throw error;
        }
    },

    /**
     * Get all my interviews (NEW)
     * Fetches all interviews for the logged-in user
     */
    getMyInterviews: async () => {
        const method = "getMyInterviews";
        log.info(method, "Fetching all my interviews...");
        log.request(method, ApiRoutes.interview.myInterviews);

        try {
            const response = await axiosInstance.get(ApiRoutes.interview.myInterviews);
            log.success(method, "My interviews retrieved", {
                count: response.data?.data?.interviews?.length || 0,
                total: response.data?.data?.total
            });
            log.response(method, response.data);
            return response.data;
        } catch (error) {
            log.error(method, "Failed to get my interviews", {
                status: error.response?.status,
                message: error.response?.data?.message || error.message
            });
            throw error;
        }
    },

    /**
     * Get interview details (NEW)
     * Fetches complete details of a specific interview
     * @param {string} sessionId - The interview session ID
     */
    getInterviewDetails: async (sessionId) => {
        const method = "getInterviewDetails";
        log.info(method, `Fetching details for session: ${sessionId}`);
        log.request(method, ApiRoutes.interview.details(sessionId));

        try {
            const response = await axiosInstance.get(
                ApiRoutes.interview.details(sessionId)
            );
            log.success(method, "Interview details retrieved", {
                hasSession: !!response.data?.data?.session,
                roundsCount: response.data?.data?.rounds?.length || 0,
                hasReport: response.data?.data?.hasReport
            });
            log.response(method, response.data);
            return response.data;
        } catch (error) {
            log.error(method, "Failed to get interview details", {
                status: error.response?.status,
                message: error.response?.data?.message || error.message
            });
            throw error;
        }
    },

    /**
     * Delete interview (NEW)
     * Deletes an interview session
     * @param {string} sessionId - The interview session ID
     */
    deleteInterview: async (sessionId) => {
        const method = "deleteInterview";
        log.info(method, `Deleting interview session: ${sessionId}`);
        log.request(method, ApiRoutes.interview.delete(sessionId));

        try {
            const response = await axiosInstance.delete(
                ApiRoutes.interview.delete(sessionId)
            );
            log.success(method, "Interview deleted successfully");
            log.response(method, response.data);
            return response.data;
        } catch (error) {
            log.error(method, "Failed to delete interview", {
                status: error.response?.status,
                message: error.response?.data?.message || error.message
            });
            throw error;
        }
    },
};

export default interviewService;
