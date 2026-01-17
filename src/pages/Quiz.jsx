import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useApiCall } from '../hooks';
import axiosInstance from '../utils/axios';
import ApiRoutes from '../routes/routes';

const Quiz = () => {
    const { isAuthenticated } = useSelector((state) => state.user);
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const { execute } = useApiCall();
    const navigate = useNavigate();

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            console.log("🔍 QUIZ: Fetching quizzes...");
            const response = await execute(async () => {
                const res = await axiosInstance.get(ApiRoutes.quizzes.getAll);
                return res.data;
            });
            console.log("✅ QUIZ: Quizzes fetched successfully:", response);
            setQuizzes(response.data || []);
        } catch (error) {
            console.error('Error fetching quizzes:', error);
            // Fallback to mock data if API fails
            setQuizzes([
                { _id: '507f1f77bcf86cd799439011', title: 'Python Basic', topic: 'Python', timeLimit: 25 },
                { _id: '507f1f77bcf86cd799439012', title: 'Python Intermediate', topic: 'Python', timeLimit: 25 },
                { _id: '507f1f77bcf86cd799439013', title: 'Python Advanced', topic: 'Python', timeLimit: 25 },
                { _id: '507f1f77bcf86cd799439014', title: 'Python Conqueror', topic: 'Python', timeLimit: 60 },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleStartQuiz = (quizId) => {
        navigate(`/quiz/${quizId}`);
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

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black py-8 sm:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8 sm:mb-12">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
                            <div className="flex-1">
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-4">Quizzes</h1>
                                <p className="text-base sm:text-lg md:text-xl text-white/80">Test your knowledge with our interactive quizzes</p>
                            </div>
                            <button
                                onClick={() => navigate('/quiz/analytics')}
                                className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium py-2.5 sm:py-2 px-4 sm:px-6 text-sm sm:text-base rounded-lg transition-all duration-300 flex items-center justify-center shadow-lg"
                            >
                                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                View Analytics
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            {quizzes.map((quiz) => (
                                <div key={quiz._id} className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-white/10 hover:border-emerald-400/30 transition-all duration-300 hover:scale-[1.01] sm:hover:scale-[1.02]">
                                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">{quiz.title}</h3>
                                    <p className="text-sm sm:text-base text-white/80 mb-3 sm:mb-4">Topic: {quiz.topic}</p>
                                    <p className="text-sm sm:text-base text-white/80 mb-4 sm:mb-6">Time: {quiz.timeLimit} minutes</p>
                                    <button
                                        onClick={() => handleStartQuiz(quiz._id)}
                                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium py-2.5 sm:py-2 px-4 text-sm sm:text-base rounded-lg transition-all duration-300 shadow-lg"
                                    >
                                        Start Quiz
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Quiz;