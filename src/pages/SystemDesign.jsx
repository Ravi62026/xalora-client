import React from "react";
import { Layout } from "../components";

const SystemDesign = () => {
  return (
    <Layout showNavbar={true}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 transform transition-all duration-500 hover:scale-105">
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                System Design
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto transform transition-all duration-700 hover:text-gray-200">
              Design scalable and efficient systems for real-world applications
            </p>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Scalability Fundamentals Card */}
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden transition-all duration-300 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10 transform hover:-translate-y-2 hover:scale-105">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-emerald-500/20 p-3 rounded-lg mr-4 transition-all duration-300 hover:scale-110">
                    <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white transition-all duration-300 hover:text-emerald-400">Scalability Fundamentals</h3>
                </div>
                <p className="text-gray-400 mb-6 transition-all duration-300 hover:text-gray-300">
                  Learn core concepts of scalability, performance, and distributed systems.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 bg-blue-900/50 text-blue-300 text-sm rounded-full transition-all duration-300 hover:bg-blue-800 hover:scale-105">Intermediate</span>
                  <span className="px-3 py-1 bg-purple-900/50 text-purple-300 text-sm rounded-full transition-all duration-300 hover:bg-purple-800 hover:scale-105">Advanced</span>
                </div>
                <button className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg font-medium text-white hover:from-emerald-500 hover:to-teal-500 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                  Start Learning
                </button>
              </div>
            </div>

            {/* Load Balancing Card */}
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden transition-all duration-300 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 transform hover:-translate-y-2 hover:scale-105">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-500/20 p-3 rounded-lg mr-4 transition-all duration-300 hover:scale-110">
                    <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white transition-all duration-300 hover:text-blue-400">Load Balancing</h3>
                </div>
                <p className="text-gray-400 mb-6 transition-all duration-300 hover:text-gray-300">
                  Understand load distribution techniques and algorithms for high availability.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 bg-blue-900/50 text-blue-300 text-sm rounded-full transition-all duration-300 hover:bg-blue-800 hover:scale-105">Intermediate</span>
                  <span className="px-3 py-1 bg-purple-900/50 text-purple-300 text-sm rounded-full transition-all duration-300 hover:bg-purple-800 hover:scale-105">Advanced</span>
                </div>
                <button className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg font-medium text-white hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                  Start Learning
                </button>
              </div>
            </div>

            {/* Caching Strategies Card */}
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden transition-all duration-300 hover:border-purple-500 hover:shadow-xl hover:shadow-purple-500/10 transform hover:-translate-y-2 hover:scale-105">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-purple-500/20 p-3 rounded-lg mr-4 transition-all duration-300 hover:scale-110">
                    <svg className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white transition-all duration-300 hover:text-purple-400">Caching Strategies</h3>
                </div>
                <p className="text-gray-400 mb-6 transition-all duration-300 hover:text-gray-300">
                  Master caching layers, CDN, Redis, and cache invalidation techniques.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 bg-blue-900/50 text-blue-300 text-sm rounded-full transition-all duration-300 hover:bg-blue-800 hover:scale-105">Intermediate</span>
                  <span className="px-3 py-1 bg-purple-900/50 text-purple-300 text-sm rounded-full transition-all duration-300 hover:bg-purple-800 hover:scale-105">Advanced</span>
                </div>
                <button className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg font-medium text-white hover:from-purple-500 hover:to-indigo-500 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                  Start Learning
                </button>
              </div>
            </div>

            {/* Database Scaling Card */}
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden transition-all duration-300 hover:border-cyan-500 hover:shadow-xl hover:shadow-cyan-500/10 transform hover:-translate-y-2 hover:scale-105">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-cyan-500/20 p-3 rounded-lg mr-4 transition-all duration-300 hover:scale-110">
                    <svg className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white transition-all duration-300 hover:text-cyan-400">Database Scaling</h3>
                </div>
                <p className="text-gray-400 mb-6 transition-all duration-300 hover:text-gray-300">
                  Learn sharding, replication, partitioning, and distributed database design.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 bg-blue-900/50 text-blue-300 text-sm rounded-full transition-all duration-300 hover:bg-blue-800 hover:scale-105">Intermediate</span>
                  <span className="px-3 py-1 bg-purple-900/50 text-purple-300 text-sm rounded-full transition-all duration-300 hover:bg-purple-800 hover:scale-105">Advanced</span>
                </div>
                <button className="w-full py-3 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg font-medium text-white hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                  Start Learning
                </button>
              </div>
            </div>

            {/* Microservices Card */}
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden transition-all duration-300 hover:border-teal-500 hover:shadow-xl hover:shadow-teal-500/10 transform hover:-translate-y-2 hover:scale-105">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-teal-500/20 p-3 rounded-lg mr-4 transition-all duration-300 hover:scale-110">
                    <svg className="h-6 w-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white transition-all duration-300 hover:text-teal-400">Microservices</h3>
                </div>
                <p className="text-gray-400 mb-6 transition-all duration-300 hover:text-gray-300">
                  Design and implement distributed systems with service-oriented architecture.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 bg-purple-900/50 text-purple-300 text-sm rounded-full transition-all duration-300 hover:bg-purple-800 hover:scale-105">Advanced</span>
                </div>
                <button className="w-full py-3 px-4 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-lg font-medium text-white hover:from-teal-500 hover:to-emerald-500 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                  Start Learning
                </button>
              </div>
            </div>

            {/* API Design Card */}
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden transition-all duration-300 hover:border-lime-500 hover:shadow-xl hover:shadow-lime-500/10 transform hover:-translate-y-2 hover:scale-105">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-lime-500/20 p-3 rounded-lg mr-4 transition-all duration-300 hover:scale-110">
                    <svg className="h-6 w-6 text-lime-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white transition-all duration-300 hover:text-lime-400">API Design</h3>
                </div>
                <p className="text-gray-400 mb-6 transition-all duration-300 hover:text-gray-300">
                  Create RESTful APIs, GraphQL, and design principles for scalable interfaces.
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

export default SystemDesign;