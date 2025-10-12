import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Layout from '../components/Layout';
import { useApiCall } from '../hooks';
import axiosInstance from '../utils/axios';
import ApiRoutes from '../routes/routes';
import { setUser } from '../store/slices/userSlice'; // Import the action to update user data

const TakeQuiz = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch(); // Add dispatch
    const { isAuthenticated, user } = useSelector((state) => state.user); // Get user from Redux store
    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [startTime, setStartTime] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null);
    const { execute } = useApiCall();

    useEffect(() => {
        // Only fetch quiz if user is authenticated and we don't have a result yet
        if (isAuthenticated && !result) {
            fetchQuiz();
        }
    }, [isAuthenticated]);

    useEffect(() => {
        // Clear timer when component unmounts or when we have a result
        let timer;
        if (quiz && timeLeft > 0 && !result) {
            timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        } else if (timeLeft === 0 && quiz && !result) {
            // Only auto-submit if result is not already set
            handleSubmit();
        }
        
        // Cleanup function to clear timer
        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [timeLeft, quiz, result]);

    const fetchQuiz = async () => {
        try {
            const response = await execute(async () => {
                const res = await axiosInstance.get(ApiRoutes.quizzes.getById(id));
                return res.data;
            });
            const quizData = response.data;
            setQuiz(quizData);
            setAnswers(new Array(quizData.questions.length).fill(null));
            setTimeLeft(quizData.timeLimit * 60);
            setStartTime(Date.now());
        } catch (error) {
            console.error('Error fetching quiz:', error);
            // Fallback mock data
            const mockQuiz = {
                _id: id,
                title: 'Mock Quiz',
                topic: 'Mock',
                timeLimit: 25,
                questions: [
                    {
                        _id: 'q1',
                        questionText: 'Mock question 1?',
                        options: ['A', 'B', 'C', 'D'],
                        correctAnswer: 0,
                        difficulty: 'easy',
                        topic: 'Mock',
                        explanation: 'Mock explanation'
                    }
                ]
            };
            setQuiz(mockQuiz);
            setAnswers(new Array(mockQuiz.questions.length).fill(null));
            setTimeLeft(mockQuiz.timeLimit * 60);
            setStartTime(Date.now());
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerSelect = (questionIndex, answerIndex) => {
        const newAnswers = [...answers];
        newAnswers[questionIndex] = answerIndex;
        setAnswers(newAnswers);
    };

    const handleSubmit = async () => {
        if (submitting) return;
        setSubmitting(true);

        const timeTaken = Math.floor((Date.now() - startTime) / 1000); // in seconds

        try {
            const response = await execute(async () => {
                const res = await axiosInstance.post(ApiRoutes.quizzes.submit, {
                    quizId: id,
                    answers,
                    timeTaken
                });
                return res.data;
            });
            setResult(response.data);
            
            // Update user data in Redux store to reflect new JBP coins
            // Instead of dispatching initializeAuth which might cause a full re-render,
            // we'll just update the user data directly
            if (response.data.jbpCoinsEarned > 0) {
                // Dispatch a specific action to update just the user data
                dispatch(setUser({
                    ...user,
                    stats: {
                        ...user.stats,
                        jbpCoins: (user.stats?.jbpCoins || 0) + response.data.jbpCoinsEarned
                    }
                }));
            }
        } catch (error) {
            console.error('Error submitting quiz:', error);
            // Fallback mock result
            const mockResult = {
                quizId: id,
                totalQuestions: quiz.questions.length,
                correctCount: answers.filter((a, i) => a === quiz.questions[i].correctAnswer).length,
                score: Math.round((answers.filter((a, i) => a === quiz.questions[i].correctAnswer).length / quiz.questions.length) * 100),
                passed: answers.filter((a, i) => a === quiz.questions[i].correctAnswer).length / quiz.questions.length >= 0.6,
                results: quiz.questions.map((q, i) => ({
                    questionId: q._id,
                    questionText: q.questionText,
                    userAnswer: answers[i],
                    correctAnswer: q.correctAnswer,
                    isCorrect: answers[i] === q.correctAnswer,
                    explanation: q.explanation
                })),
                submissionId: 'fallback-submission-id'
            };
            setResult(mockResult);
        } finally {
            setSubmitting(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!isAuthenticated) {
        return (
            <Layout>
                <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center">
                    <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-2xl">
                        <h2 className="text-2xl font-bold text-white mb-4">Please Login</h2>
                        <p className="text-white/80">You need to be logged in to take quizzes.</p>
                    </div>
                </div>
            </Layout>
        );
    }

    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>
            </Layout>
        );
    }

    if (result) {
        // Function to handle certificate download
        const handleDownloadCertificate = async () => {
            try {
                const response = await axiosInstance.get(`/api/v1/quizzes/certificate/${result.submissionId}`, {
                    responseType: 'blob'
                });
                
                const blob = new Blob([response.data], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${quiz.title}_Certificate.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            } catch (error) {
                console.error('Error downloading certificate:', error);
                alert('Failed to download certificate. Please try again.');
            }
        };

        return (
            <Layout>
                <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black py-12">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-lg p-8 border border-white/10">
                            <h1 className="text-3xl font-bold text-white text-center mb-8">Quiz Results</h1>

                            <div className="text-center mb-8">
                                <div className="text-6xl font-bold mb-4">
                                    {result.score}%
                                </div>
                                <div className="text-xl text-gray-300">
                                    {result.correctCount} out of {result.totalQuestions} correct
                                </div>
                                <div className={`text-lg font-semibold mt-4 ${result.passed ? 'text-green-400' : 'text-red-400'}`}>
                                    {result.passed ? 'PASSED' : 'FAILED'}
                                </div>
                                
                                {/* JBP Coins Reward */}
                                {result.jbpCoinsEarned > 0 && (
                                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                        <div className="flex items-center justify-center mb-2">
                                            <svg className="h-6 w-6 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
                                            </svg>
                                            <span className="text-lg font-semibold text-yellow-700">
                                                🎉 Congratulations! You earned {result.jbpCoinsEarned} JBP Coins!
                                            </span>
                                        </div>
                                        <p className="text-sm text-yellow-600">
                                            {result.message}
                                        </p>
                                    </div>
                                )}
                                
                                {/* Certificate Download for Passed Quizzes */}
                                {result.passed && result.submissionId && (
                                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                        <div className="flex items-center justify-center mb-2">
                                            <svg className="h-6 w-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <span className="text-lg font-semibold text-blue-700">
                                                🎓 Download Your Certificate
                                            </span>
                                        </div>
                                        <p className="text-sm text-blue-600 mb-4">
                                            Share your achievement on LinkedIn and earn JBP coins!
                                        </p>
                                        <button
                                            onClick={handleDownloadCertificate}
                                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-all duration-300 flex items-center mx-auto"
                                        >
                                            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                            Download Certificate
                                        </button>
                                    </div>
                                )}
                                
                                {/* Encouragement message for failed attempts */}
                                {!result.passed && (
                                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                        <p className="text-blue-700">
                                            {result.message}
                                        </p>
                                        <p className="text-sm text-blue-600 mt-2">
                                            Keep practicing! You can retake this quiz to earn JBP coins.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                {result.results.map((item, index) => (
                                    <div key={index} className={`p-4 rounded-lg border ${item.isCorrect ? 'bg-green-900/30 border-green-700/50' : 'bg-red-900/30 border-red-700/50'}`}>
                                        <div className="font-semibold mb-2 text-white">
                                            Question {index + 1}: {item.questionText}
                                        </div>
                                        <div className="text-sm text-gray-300 mb-2">
                                            Your answer: {item.userAnswer !== null ? quiz.questions[index].options[item.userAnswer] : 'Not answered'}
                                        </div>
                                        {!item.isCorrect && (
                                            <div className="text-sm text-red-300 mb-2">
                                                Correct answer: {quiz.questions[index].options[item.correctAnswer]}
                                            </div>
                                        )}
                                        {item.explanation && (
                                            <div className="text-sm text-gray-200">
                                                Explanation: {item.explanation}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="text-center mt-8">
                                <button
                                    onClick={() => navigate('/quiz')}
                                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-all duration-300"
                                >
                                    Back to Quizzes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    if (!quiz) {
        return (
            <Layout>
                <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center">
                    <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-2xl">
                        <h2 className="text-2xl font-bold text-white mb-4">Quiz Not Found</h2>
                        <p className="text-white/80">The quiz you're looking for doesn't exist.</p>
                    </div>
                </div>
            </Layout>
        );
    }

    const question = quiz.questions[currentQuestion];

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-lg p-8 border border-white/10">
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-2xl font-bold text-white">{quiz.title}</h1>
                            <div className="text-xl font-mono text-red-400">
                                Time: {formatTime(timeLeft)}
                            </div>
                        </div>

                        <div className="mb-8">
                            <div className="flex justify-between text-sm text-gray-600 mb-4">
                                <span>Question {currentQuestion + 1} of {quiz.questions.length}</span>
                                <span>Answered: {answers.filter(a => a !== null).length}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-xl font-semibold mb-4 text-white">{question.questionText}</h2>
                            <div className="space-y-3">
                                {question.options.map((option, index) => (
                                    <label key={index} className="flex items-center space-x-3 cursor-pointer bg-white/5 hover:bg-white/10 p-3 rounded-lg transition-colors">
                                        <input
                                            type="radio"
                                            name={`question-${currentQuestion}`}
                                            value={index}
                                            checked={answers[currentQuestion] === index}
                                            onChange={() => handleAnswerSelect(currentQuestion, index)}
                                            className="w-4 h-4 text-purple-500 focus:ring-purple-500 bg-gray-700 border-gray-600"
                                        />
                                        <span className="text-gray-200">{option}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-between">
                            <button
                                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                                disabled={currentQuestion === 0}
                                className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                            >
                                Previous
                            </button>

                            {currentQuestion < quiz.questions.length - 1 ? (
                                <button
                                    onClick={() => setCurrentQuestion(currentQuestion + 1)}
                                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-all duration-300"
                                >
                                    Next
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-700 disabled:to-gray-800 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                                >
                                    {submitting ? 'Submitting...' : 'Submit Quiz'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default TakeQuiz;