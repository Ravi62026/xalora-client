import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import interviewService from '../services/interviewService';

// Initial state
const initialState = {
    // Session
    sessionId: null,
    status: 'idle', // idle, loading, active, completed, error
    error: null, 

    // Candidate info
    candidateInfo: null,
    resumeAnalysis: null,

    // Interview progress
    currentRound: null,
    completedRounds: [],
    totalRounds: 5,

    // Current question
    currentQuestion: null,
    currentFollowup: null,
    isFollowup: false,

    // Evaluation feedback
    lastEvaluation: null,
    lastFeedback: null,

    // Report
    report: null,

    // Voice
    isListening: false,
    isSpeaking: false,
    transcript: '',

    // UI state
    isLoading: false,
    loadingMessage: '',
};

// Action types
const ActionTypes = {
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    CLEAR_ERROR: 'CLEAR_ERROR',

    // Session
    START_SESSION: 'START_SESSION',
    SET_SESSION_STATUS: 'SET_SESSION_STATUS',
    RESTORE_SESSION: 'RESTORE_SESSION',

    // Questions
    SET_QUESTION: 'SET_QUESTION',
    SET_FOLLOWUP: 'SET_FOLLOWUP',
    CLEAR_CURRENT_QUESTION: 'CLEAR_CURRENT_QUESTION',

    // Evaluation
    SET_EVALUATION: 'SET_EVALUATION',

    // Rounds
    COMPLETE_ROUND: 'COMPLETE_ROUND',
    SET_CURRENT_ROUND: 'SET_CURRENT_ROUND',

    // Report
    SET_REPORT: 'SET_REPORT',

    // Voice
    SET_LISTENING: 'SET_LISTENING',
    SET_SPEAKING: 'SET_SPEAKING',
    SET_TRANSCRIPT: 'SET_TRANSCRIPT',

    // Reset
    RESET: 'RESET',
};

// Reducer
function interviewReducer(state, action) {
    switch (action.type) {
        case ActionTypes.SET_LOADING:
            return {
                ...state,
                isLoading: action.payload.isLoading,
                loadingMessage: action.payload.message || '',
            };

        case ActionTypes.SET_ERROR:
            return {
                ...state,
                error: action.payload,
                status: 'error',
                isLoading: false,
            };

        case ActionTypes.CLEAR_ERROR:
            return {
                ...state,
                error: null,
            };

        case ActionTypes.START_SESSION:
            return {
                ...state,
                sessionId: action.payload.sessionId,
                candidateInfo: action.payload.candidateInfo,
                resumeAnalysis: action.payload.resumeAnalysis,
                status: 'active',
                currentRound: action.payload.currentRound || 'formal_qa',
                error: null,
                isLoading: false,
            };

        case ActionTypes.SET_SESSION_STATUS:
            return {
                ...state,
                status: action.payload,
            };

        case ActionTypes.RESTORE_SESSION:
            return {
                ...state,
                sessionId: action.payload.sessionId,
                candidateInfo: action.payload.candidateInfo,
                resumeAnalysis: action.payload.resumeAnalysis,
                currentRound: action.payload.currentRound,
                completedRounds: action.payload.completedRounds || [],
                status: action.payload.status,
            };

        case ActionTypes.SET_QUESTION:
            return {
                ...state,
                currentQuestion: action.payload,
                currentFollowup: null,
                isFollowup: false,
                isLoading: false,
            };

        case ActionTypes.SET_FOLLOWUP:
            return {
                ...state,
                currentFollowup: action.payload,
                isFollowup: true,
                isLoading: false,
            };

        case ActionTypes.CLEAR_CURRENT_QUESTION:
            return {
                ...state,
                currentQuestion: null,
                currentFollowup: null,
                isFollowup: false,
            };

        case ActionTypes.SET_EVALUATION:
            return {
                ...state,
                lastEvaluation: action.payload.evaluation,
                lastFeedback: action.payload.feedback,
                isLoading: false,
            };

        case ActionTypes.COMPLETE_ROUND:
            return {
                ...state,
                completedRounds: [...state.completedRounds, action.payload.roundType],
                currentRound: action.payload.nextRound,
                currentQuestion: null,
                currentFollowup: null,
                isFollowup: false,
            };

        case ActionTypes.SET_CURRENT_ROUND:
            return {
                ...state,
                currentRound: action.payload,
            };

        case ActionTypes.SET_REPORT:
            return {
                ...state,
                report: action.payload,
                status: 'completed',
                isLoading: false,
            };

        case ActionTypes.SET_LISTENING:
            return {
                ...state,
                isListening: action.payload,
            };

        case ActionTypes.SET_SPEAKING:
            return {
                ...state,
                isSpeaking: action.payload,
            };

        case ActionTypes.SET_TRANSCRIPT:
            return {
                ...state,
                transcript: action.payload,
            };

        case ActionTypes.RESET:
            return initialState;

        default:
            return state;
    }
}

// Context
const InterviewContext = createContext(null);

// Round order for navigation
const ROUND_ORDER = ['formal_qa', 'technical', 'coding', 'system_design', 'hr'];
const ROUND_DISPLAY_NAMES = {
    formal_qa: 'Formal Q&A',
    technical: 'Technical',
    coding: 'Coding Challenge',
    system_design: 'System Design',
    hr: 'HR',
};

// Provider component
export function InterviewProvider({ children }) {
    const [state, dispatch] = useReducer(interviewReducer, initialState);

    // Start a new interview session
    const startInterview = useCallback(async (formData) => {
        try {
            dispatch({
                type: ActionTypes.SET_LOADING,
                payload: { isLoading: true, message: 'Analyzing your resume...' },
            });

            const response = await interviewService.startInterview(formData);

            if (response.success) {
                dispatch({
                    type: ActionTypes.START_SESSION,
                    payload: {
                        sessionId: response.data.sessionId,
                        candidateInfo: response.data.candidateInfo,
                        resumeAnalysis: response.data.resumeAnalysis,
                        currentRound: response.data.currentRound || 'formal_qa',
                    },
                });

                // Store session ID in localStorage for persistence
                localStorage.setItem('interviewSessionId', response.data.sessionId);

                return { success: true, sessionId: response.data.sessionId };
            } else {
                throw new Error(response.message || 'Failed to start interview');
            }
        } catch (error) {
            dispatch({
                type: ActionTypes.SET_ERROR,
                payload: error.response?.data?.message || error.message,
            });
            return { success: false, error: error.message };
        }
    }, []);

    // Restore session from localStorage
    const restoreSession = useCallback(async () => {
        const savedSessionId = localStorage.getItem('interviewSessionId');
        if (!savedSessionId) return { success: false };

        try {
            dispatch({
                type: ActionTypes.SET_LOADING,
                payload: { isLoading: true, message: 'Restoring your session...' },
            });

            const response = await interviewService.getSessionStatus(savedSessionId);

            if (response.success && response.data.status !== 'completed') {
                dispatch({
                    type: ActionTypes.RESTORE_SESSION,
                    payload: {
                        sessionId: savedSessionId,
                        candidateInfo: response.data.candidateInfo,
                        resumeAnalysis: response.data.resumeAnalysis,
                        currentRound: response.data.currentRound,
                        completedRounds: response.data.completedRounds || [],
                        status: 'active',
                    },
                });
                return { success: true, sessionId: savedSessionId };
            } else {
                localStorage.removeItem('interviewSessionId');
                return { success: false };
            }
        } catch (error) {
            localStorage.removeItem('interviewSessionId');
            dispatch({ type: ActionTypes.SET_LOADING, payload: { isLoading: false } });
            return { success: false };
        }
    }, []);

    // Get the next question
    const getQuestion = useCallback(async (roundType) => {
        if (!state.sessionId) return { success: false, error: 'No active session' };

        try {
            dispatch({
                type: ActionTypes.SET_LOADING,
                payload: { isLoading: true, message: 'Generating question...' },
            });

            const response = await interviewService.getQuestion(state.sessionId, roundType);

            if (response.success) {
                dispatch({
                    type: ActionTypes.SET_QUESTION,
                    payload: response.data.question,
                });
                return { success: true, question: response.data.question };
            } else {
                throw new Error(response.message || 'Failed to get question');
            }
        } catch (error) {
            dispatch({
                type: ActionTypes.SET_ERROR,
                payload: error.response?.data?.message || error.message,
            });
            return { success: false, error: error.message };
        }
    }, [state.sessionId]);

    // Submit an answer
    const submitAnswer = useCallback(async (answer, timeRemaining = 300) => {
        if (!state.sessionId || !state.currentQuestion) {
            return { success: false, error: 'No active question' };
        }

        try {
            dispatch({
                type: ActionTypes.SET_LOADING,
                payload: { isLoading: true, message: 'Evaluating your response...' },
            });

            const response = await interviewService.submitAnswer(
                state.sessionId,
                state.currentRound,
                state.currentQuestion.id || state.currentQuestion._id,
                answer,
                timeRemaining
            );

            if (response.success) {
                const { evaluation, nextAction, followupQuestion, feedback } = response.data;

                dispatch({
                    type: ActionTypes.SET_EVALUATION,
                    payload: { evaluation, feedback },
                });

                // Handle next action
                if (nextAction === 'followup' && followupQuestion) {
                    dispatch({
                        type: ActionTypes.SET_FOLLOWUP,
                        payload: followupQuestion,
                    });
                    return { success: true, action: 'followup', followup: followupQuestion };
                } else if (nextAction === 'next_question') {
                    dispatch({ type: ActionTypes.CLEAR_CURRENT_QUESTION });
                    return { success: true, action: 'next_question' };
                } else if (nextAction === 'complete_round') {
                    return { success: true, action: 'complete_round' };
                }

                return { success: true, action: nextAction || 'next_question' };
            } else {
                throw new Error(response.message || 'Failed to submit answer');
            }
        } catch (error) {
            dispatch({
                type: ActionTypes.SET_ERROR,
                payload: error.response?.data?.message || error.message,
            });
            return { success: false, error: error.message };
        }
    }, [state.sessionId, state.currentRound, state.currentQuestion]);

    // Submit follow-up answer
    const submitFollowupAnswer = useCallback(async (answer, timeRemaining = 300) => {
        if (!state.sessionId || !state.currentFollowup) {
            return { success: false, error: 'No active follow-up' };
        }

        try {
            dispatch({
                type: ActionTypes.SET_LOADING,
                payload: { isLoading: true, message: 'Evaluating your follow-up response...' },
            });

            const response = await interviewService.submitFollowupAnswer(
                state.sessionId,
                state.currentRound,
                state.currentQuestion.id || state.currentQuestion._id,
                state.currentFollowup.id || state.currentFollowup._id,
                answer,
                timeRemaining
            );

            if (response.success) {
                const { evaluation, nextAction, followupQuestion, feedback } = response.data;

                dispatch({
                    type: ActionTypes.SET_EVALUATION,
                    payload: { evaluation, feedback },
                });

                // Handle next action
                if (nextAction === 'followup' && followupQuestion) {
                    dispatch({
                        type: ActionTypes.SET_FOLLOWUP,
                        payload: followupQuestion,
                    });
                    return { success: true, action: 'followup', followup: followupQuestion };
                } else if (nextAction === 'next_question') {
                    dispatch({ type: ActionTypes.CLEAR_CURRENT_QUESTION });
                    return { success: true, action: 'next_question' };
                } else if (nextAction === 'complete_round') {
                    return { success: true, action: 'complete_round' };
                }

                return { success: true, action: nextAction };
            } else {
                throw new Error(response.message || 'Failed to submit follow-up answer');
            }
        } catch (error) {
            dispatch({
                type: ActionTypes.SET_ERROR,
                payload: error.response?.data?.message || error.message,
            });
            return { success: false, error: error.message };
        }
    }, [state.sessionId, state.currentRound, state.currentQuestion, state.currentFollowup]);

    // Complete the current round
    const completeRound = useCallback(async () => {
        if (!state.sessionId || !state.currentRound) {
            return { success: false, error: 'No active round' };
        }

        try {
            dispatch({
                type: ActionTypes.SET_LOADING,
                payload: { isLoading: true, message: 'Completing round...' },
            });

            const response = await interviewService.completeRound(state.sessionId, state.currentRound);

            if (response.success) {
                const currentIndex = ROUND_ORDER.indexOf(state.currentRound);
                const nextRound = currentIndex < ROUND_ORDER.length - 1
                    ? ROUND_ORDER[currentIndex + 1]
                    : null;

                dispatch({
                    type: ActionTypes.COMPLETE_ROUND,
                    payload: {
                        roundType: state.currentRound,
                        nextRound,
                    },
                });

                dispatch({
                    type: ActionTypes.SET_LOADING,
                    payload: { isLoading: false },
                });

                return { success: true, nextRound };
            } else {
                throw new Error(response.message || 'Failed to complete round');
            }
        } catch (error) {
            dispatch({
                type: ActionTypes.SET_ERROR,
                payload: error.response?.data?.message || error.message,
            });
            return { success: false, error: error.message };
        }
    }, [state.sessionId, state.currentRound]);

    // Generate final report
    const generateReport = useCallback(async () => {
        if (!state.sessionId) {
            return { success: false, error: 'No active session' };
        }

        try {
            dispatch({
                type: ActionTypes.SET_LOADING,
                payload: { isLoading: true, message: 'Generating your interview report...' },
            });

            const response = await interviewService.generateReport(state.sessionId);

            if (response.success) {
                dispatch({
                    type: ActionTypes.SET_REPORT,
                    payload: response.data.report,
                });

                // Clear session from localStorage
                localStorage.removeItem('interviewSessionId');

                return { success: true, report: response.data.report };
            } else {
                throw new Error(response.message || 'Failed to generate report');
            }
        } catch (error) {
            dispatch({
                type: ActionTypes.SET_ERROR,
                payload: error.response?.data?.message || error.message,
            });
            return { success: false, error: error.message };
        }
    }, [state.sessionId]);

    // Text to speech
    const speakText = useCallback(async (text) => {
        if (!text || !('speechSynthesis' in window)) {
            return { success: false, error: "Browser TTS not supported" };
        }

        try {
            dispatch({ type: ActionTypes.SET_SPEAKING, payload: true });
            speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.onend = () => dispatch({ type: ActionTypes.SET_SPEAKING, payload: false });
            utterance.onerror = () => dispatch({ type: ActionTypes.SET_SPEAKING, payload: false });
            speechSynthesis.speak(utterance);
            return { success: true };
        } catch (error) {
            dispatch({ type: ActionTypes.SET_SPEAKING, payload: false });
            console.error('Browser TTS Error:', error);
            return { success: false, error: error.message };
        }
    }, []);

    // Set round manually (for navigation)
    const setCurrentRound = useCallback((roundType) => {
        dispatch({ type: ActionTypes.SET_CURRENT_ROUND, payload: roundType });
    }, []);

    // Clear error
    const clearError = useCallback(() => {
        dispatch({ type: ActionTypes.CLEAR_ERROR });
    }, []);

    // Reset everything
    const resetInterview = useCallback(() => {
        localStorage.removeItem('interviewSessionId');
        dispatch({ type: ActionTypes.RESET });
    }, []);

    // Get round display name
    const getRoundDisplayName = useCallback((roundType) => {
        return ROUND_DISPLAY_NAMES[roundType] || roundType;
    }, []);

    // Get round number
    const getRoundNumber = useCallback((roundType) => {
        return ROUND_ORDER.indexOf(roundType) + 1;
    }, []);

    // Check if all rounds are complete
    const areAllRoundsComplete = useCallback(() => {
        return state.completedRounds.length >= ROUND_ORDER.length;
    }, [state.completedRounds]);

    const value = {
        // State
        ...state,

        // Constants
        ROUND_ORDER,
        ROUND_DISPLAY_NAMES,

        // Session actions
        startInterview,
        restoreSession,
        resetInterview,

        // Question actions
        getQuestion,
        submitAnswer,
        submitFollowupAnswer,

        // Round actions
        completeRound,
        setCurrentRound,

        // Report
        generateReport,

        // Voice
        speakText,

        // Utilities
        clearError,
        getRoundDisplayName,
        getRoundNumber,
        areAllRoundsComplete,
    };

    return (
        <InterviewContext.Provider value={value}>
            {children}
        </InterviewContext.Provider>
    );
}

// Hook to use interview context
export function useInterview() {
    const context = useContext(InterviewContext);
    if (!context) {
        throw new Error('useInterview must be used within an InterviewProvider');
    }
    return context;
}

export default InterviewContext;
