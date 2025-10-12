import React from "react";
import { Layout } from "../components";

const InterviewPrep = () => {
  return (
    <Layout showNavbar={true}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 transform transition-all duration-500 hover:scale-105">
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Interview Prep
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto transform transition-all duration-700 hover:text-gray-200">
              Ace your technical interviews with comprehensive preparation resources
            </p>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Coding Interview Card */}
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden transition-all duration-300 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10 transform hover:-translate-y-2 hover:scale-105">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-emerald-500/20 p-3 rounded-lg mr-4 transition-all duration-300 hover:scale-110">
                    <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white transition-all duration-300 hover:text-emerald-400">Coding Interviews</h3>
                </div>
                <p className="text-gray-400 mb-6 transition-all duration-300 hover:text-gray-300">
                  Practice data structures, algorithms, and problem-solving techniques.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 bg-emerald-900/50 text-emerald-300 text-sm rounded-full transition-all duration-300 hover:bg-emerald-800 hover:scale-105">Beginner</span>
                  <span className="px-3 py-1 bg-blue-900/50 text-blue-300 text-sm rounded-full transition-all duration-300 hover:bg-blue-800 hover:scale-105">Intermediate</span>
                  <span className="px-3 py-1 bg-purple-900/50 text-purple-300 text-sm rounded-full transition-all duration-300 hover:bg-purple-800 hover:scale-105">Advanced</span>
                </div>
                <button className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg font-medium text-white hover:from-emerald-500 hover:to-teal-500 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                  Start Practicing
                </button>
              </div>
            </div>

            {/* System Design Interview Card */}
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden transition-all duration-300 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 transform hover:-translate-y-2 hover:scale-105">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-500/20 p-3 rounded-lg mr-4 transition-all duration-300 hover:scale-110">
                    <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white transition-all duration-300 hover:text-blue-400">System Design Interviews</h3>
                </div>
                <p className="text-gray-400 mb-6 transition-all duration-300 hover:text-gray-300">
                  Master architecture design, scalability, and distributed systems concepts.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 bg-blue-900/50 text-blue-300 text-sm rounded-full transition-all duration-300 hover:bg-blue-800 hover:scale-105">Intermediate</span>
                  <span className="px-3 py-1 bg-purple-900/50 text-purple-300 text-sm rounded-full transition-all duration-300 hover:bg-purple-800 hover:scale-105">Advanced</span>
                </div>
                <button className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg font-medium text-white hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                  Start Practicing
                </button>
              </div>
            </div>

            {/* Behavioral Interview Card */}
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden transition-all duration-300 hover:border-purple-500 hover:shadow-xl hover:shadow-purple-500/10 transform hover:-translate-y-2 hover:scale-105">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-purple-500/20 p-3 rounded-lg mr-4 transition-all duration-300 hover:scale-110">
                    <svg className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white transition-all duration-300 hover:text-purple-400">Behavioral Interviews</h3>
                </div>
                <p className="text-gray-400 mb-6 transition-all duration-300 hover:text-gray-300">
                  Prepare for soft skills assessment with STAR method and common questions.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 bg-emerald-900/50 text-emerald-300 text-sm rounded-full transition-all duration-300 hover:bg-emerald-800 hover:scale-105">Beginner</span>
                  <span className="px-3 py-1 bg-blue-900/50 text-blue-300 text-sm rounded-full transition-all duration-300 hover:bg-blue-800 hover:scale-105">Intermediate</span>
                </div>
                <button className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg font-medium text-white hover:from-purple-500 hover:to-indigo-500 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                  Start Practicing
                </button>
              </div>
            </div>

            {/* Mock Interviews Card */}
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden transition-all duration-300 hover:border-cyan-500 hover:shadow-xl hover:shadow-cyan-500/10 transform hover:-translate-y-2 hover:scale-105">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-cyan-500/20 p-3 rounded-lg mr-4 transition-all duration-300 hover:scale-110">
                    <svg className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white transition-all duration-300 hover:text-cyan-400">Mock Interviews</h3>
                </div>
                <p className="text-gray-400 mb-6 transition-all duration-300 hover:text-gray-300">
                  Practice with simulated interviews and get detailed feedback.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 bg-emerald-900/50 text-emerald-300 text-sm rounded-full transition-all duration-300 hover:bg-emerald-800 hover:scale-105">Beginner</span>
                  <span className="px-3 py-1 bg-blue-900/50 text-blue-300 text-sm rounded-full transition-all duration-300 hover:bg-blue-800 hover:scale-105">Intermediate</span>
                  <span className="px-3 py-1 bg-purple-900/50 text-purple-300 text-sm rounded-full transition-all duration-300 hover:bg-purple-800 hover:scale-105">Advanced</span>
                </div>
                <button className="w-full py-3 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg font-medium text-white hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                  Start Practicing
                </button>
              </div>
            </div>

            {/* Resume Review Card */}
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden transition-all duration-300 hover:border-teal-500 hover:shadow-xl hover:shadow-teal-500/10 transform hover:-translate-y-2 hover:scale-105">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-teal-500/20 p-3 rounded-lg mr-4 transition-all duration-300 hover:scale-110">
                    <svg className="h-6 w-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white transition-all duration-300 hover:text-teal-400">Resume Review</h3>
                </div>
                <p className="text-gray-400 mb-6 transition-all duration-300 hover:text-gray-300">
                  Optimize your resume for tech roles with AI-powered suggestions.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 bg-emerald-900/50 text-emerald-300 text-sm rounded-full transition-all duration-300 hover:bg-emerald-800 hover:scale-105">Beginner</span>
                  <span className="px-3 py-1 bg-blue-900/50 text-blue-300 text-sm rounded-full transition-all duration-300 hover:bg-blue-800 hover:scale-105">Intermediate</span>
                </div>
                <button className="w-full py-3 px-4 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-lg font-medium text-white hover:from-teal-500 hover:to-emerald-500 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                  Start Review
                </button>
              </div>
            </div>

            {/* Salary Negotiation Card */}
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden transition-all duration-300 hover:border-lime-500 hover:shadow-xl hover:shadow-lime-500/10 transform hover:-translate-y-2 hover:scale-105">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-lime-500/20 p-3 rounded-lg mr-4 transition-all duration-300 hover:scale-110">
                    <svg className="h-6 w-6 text-lime-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white transition-all duration-300 hover:text-lime-400">Salary Negotiation</h3>
                </div>
                <p className="text-gray-400 mb-6 transition-all duration-300 hover:text-gray-300">
                  Learn strategies to negotiate better compensation packages.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 bg-emerald-900/50 text-emerald-300 text-sm rounded-full transition-all duration-300 hover:bg-emerald-800 hover:scale-105">Beginner</span>
                  <span className="px-3 py-1 bg-blue-900/50 text-blue-300 text-sm rounded-full transition-all duration-300 hover:bg-blue-800 hover:scale-105">Intermediate</span>
                </div>
                <button className="w-full py-3 px-4 bg-gradient-to-r from-lime-600 to-green-600 rounded-lg font-medium text-white hover:from-lime-500 hover:to-green-500 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                  Start Learning
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default InterviewPrep;