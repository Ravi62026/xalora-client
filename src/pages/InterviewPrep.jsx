import React from "react";
import { Layout } from "../components";

const InterviewPrep = () => {
  return (
    <Layout showNavbar={true}>
      <div className="min-h-screen xalora-grid-bg py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 transform transition-all duration-500 hover:scale-105">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Interview Prep
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Ace your technical interviews with comprehensive preparation resources
            </p>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Coding Interview Card */}
            <div className="bg-white/80 border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-indigo-500/20 rounded-2xl transform hover:-translate-y-1">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-emerald-50 p-3 rounded-lg mr-4 border border-emerald-100">
                    <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 hover:text-indigo-600 transition-colors">Coding Interviews</h3>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Practice data structures, algorithms, and problem-solving techniques.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs rounded-full font-semibold">Beginner</span>
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 text-xs rounded-full font-semibold">Intermediate</span>
                  <span className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-100 text-xs rounded-full font-semibold">Advanced</span>
                </div>
                <button className="w-full py-3 px-4 bg-indigo-600 rounded-xl font-bold text-white hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100">
                  Start Practicing
                </button>
              </div>
            </div>

            {/* System Design Interview Card */}
            <div className="bg-white/80 border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-indigo-500/20 rounded-2xl transform hover:-translate-y-1">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-50 p-3 rounded-lg mr-4 border border-blue-100">
                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 hover:text-indigo-600 transition-colors">System Design Interviews</h3>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Master architecture design, scalability, and distributed systems concepts.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 text-xs rounded-full font-semibold">Intermediate</span>
                  <span className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-100 text-xs rounded-full font-semibold">Advanced</span>
                </div>
                <button className="w-full py-3 px-4 bg-indigo-600 rounded-xl font-bold text-white hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100">
                  Start Practicing
                </button>
              </div>
            </div>

            {/* Behavioral Interview Card */}
            <div className="bg-white/80 border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-indigo-500/20 rounded-2xl transform hover:-translate-y-1">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-purple-50 p-3 rounded-lg mr-4 border border-purple-100">
                    <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 hover:text-indigo-600 transition-colors">Behavioral Interviews</h3>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Prepare for soft skills assessment with STAR method and common questions.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs rounded-full font-semibold">Beginner</span>
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 text-xs rounded-full font-semibold">Intermediate</span>
                </div>
                <button className="w-full py-3 px-4 bg-indigo-600 rounded-xl font-bold text-white hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100">
                  Start Practicing
                </button>
              </div>
            </div>

            {/* Mock Interviews Card */}
            <div className="bg-white/80 border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-indigo-500/20 rounded-2xl transform hover:-translate-y-1">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-cyan-50 p-3 rounded-lg mr-4 border border-cyan-100">
                    <svg className="h-6 w-6 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 hover:text-indigo-600 transition-colors">Mock Interviews</h3>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Practice with simulated interviews and get detailed feedback.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs rounded-full font-semibold">Beginner</span>
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 text-xs rounded-full font-semibold">Intermediate</span>
                  <span className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-100 text-xs rounded-full font-semibold">Advanced</span>
                </div>
                <button className="w-full py-3 px-4 bg-indigo-600 rounded-xl font-bold text-white hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100">
                  Start Practicing
                </button>
              </div>
            </div>

            {/* Resume Review Card */}
            <div className="bg-white/80 border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-indigo-500/20 rounded-2xl transform hover:-translate-y-1">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-teal-50 p-3 rounded-lg mr-4 border border-teal-100">
                    <svg className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 hover:text-indigo-600 transition-colors">Resume Review</h3>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Optimize your resume for tech roles with AI-powered suggestions.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs rounded-full font-semibold">Beginner</span>
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 text-xs rounded-full font-semibold">Intermediate</span>
                </div>
                <button className="w-full py-3 px-4 bg-indigo-600 rounded-xl font-bold text-white hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100">
                  Start Review
                </button>
              </div>
            </div>

            {/* Salary Negotiation Card */}
            <div className="bg-white/80 border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-indigo-500/20 rounded-2xl transform hover:-translate-y-1">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-lime-50 p-3 rounded-lg mr-4 border border-lime-100">
                    <svg className="h-6 w-6 text-lime-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 hover:text-indigo-600 transition-colors">Salary Negotiation</h3>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Learn strategies to negotiate better compensation packages.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs rounded-full font-semibold">Beginner</span>
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 text-xs rounded-full font-semibold">Intermediate</span>
                </div>
                <button className="w-full py-3 px-4 bg-indigo-600 rounded-xl font-bold text-white hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100">
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