import React from "react";
import { Layout } from "../components";

const About = () => {
  return (
    <Layout showNavbar={true}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 transform transition-all duration-500 hover:scale-105">
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                About Xalora
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto transform transition-all duration-700 hover:text-gray-200">
              Revolutionizing technical education with AI-powered learning experiences
            </p>
          </div>

          {/* Mission Section */}
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl border border-gray-700 p-8 mb-12 transition-all duration-300 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold text-white mb-4 transition-all duration-300 hover:text-emerald-400">Our Mission</h2>
                <p className="text-gray-300 mb-6 transition-all duration-300 hover:text-gray-200">
                  At Xalora, we're on a mission to democratize technical education by making high-quality 
                  learning resources accessible to everyone, everywhere. We believe that talent is universal, 
                  but opportunities are not.
                </p>
                <p className="text-gray-300 mb-6 transition-all duration-300 hover:text-gray-200">
                  Our platform combines cutting-edge AI technologies with expert-curated content to create 
                  personalized learning paths that adapt to each student's unique needs and goals.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center group">
                    <div className="bg-emerald-500/20 p-2 rounded-lg mr-3 transition-all duration-300 group-hover:scale-110">
                      <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-300 transition-all duration-300 group-hover:text-gray-200">Personalized Learning</span>
                  </div>
                  <div className="flex items-center group">
                    <div className="bg-blue-500/20 p-2 rounded-lg mr-3 transition-all duration-300 group-hover:scale-110">
                      <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-300 transition-all duration-300 group-hover:text-gray-200">AI-Powered Insights</span>
                  </div>
                  <div className="flex items-center group">
                    <div className="bg-purple-500/20 p-2 rounded-lg mr-3 transition-all duration-300 group-hover:scale-110">
                      <svg className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-300 transition-all duration-300 group-hover:text-gray-200">Industry-Relevant Skills</span>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-2xl p-8 border border-emerald-500/20 transition-all duration-300 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/20">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-emerald-400 mb-2 transition-all duration-300 hover:text-emerald-300">10K+</div>
                    <div className="text-gray-300 transition-all duration-300 hover:text-gray-200">Students Empowered</div>
                  </div>
                  <div className="flex justify-between mt-6">
                    <div className="text-center group">
                      <div className="text-2xl font-bold text-blue-400 transition-all duration-300 group-hover:text-blue-300">500+</div>
                      <div className="text-gray-400 text-sm transition-all duration-300 group-hover:text-gray-300">Coding Problems</div>
                    </div>
                    <div className="text-center group">
                      <div className="text-2xl font-bold text-purple-400 transition-all duration-300 group-hover:text-purple-300">50+</div>
                      <div className="text-gray-400 text-sm transition-all duration-300 group-hover:text-gray-300">Expert Instructors</div>
                    </div>
                    <div className="text-center group">
                      <div className="text-2xl font-bold text-cyan-400 transition-all duration-300 group-hover:text-cyan-300">95%</div>
                      <div className="text-gray-400 text-sm transition-all duration-300 group-hover:text-gray-300">Success Rate</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-12 transition-all duration-300 hover:text-emerald-400">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 transition-all duration-300 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10 transform hover:-translate-y-2 hover:scale-105">
                <div className="bg-emerald-500/20 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4 transition-all duration-300 hover:scale-110">
                  <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 transition-all duration-300 hover:text-emerald-400">Innovation</h3>
                <p className="text-gray-400 transition-all duration-300 hover:text-gray-300">
                  We constantly push boundaries to deliver cutting-edge learning experiences.
                </p>
              </div>

              <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 transition-all duration-300 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 transform hover:-translate-y-2 hover:scale-105">
                <div className="bg-blue-500/20 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4 transition-all duration-300 hover:scale-110">
                  <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 transition-all duration-300 hover:text-blue-400">Community</h3>
                <p className="text-gray-400 transition-all duration-300 hover:text-gray-300">
                  We believe in the power of collaborative learning and peer support.
                </p>
              </div>

              <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 transition-all duration-300 hover:border-purple-500 hover:shadow-xl hover:shadow-purple-500/10 transform hover:-translate-y-2 hover:scale-105">
                <div className="bg-purple-500/20 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4 transition-all duration-300 hover:scale-110">
                  <svg className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 transition-all duration-300 hover:text-purple-400">Excellence</h3>
                <p className="text-gray-400 transition-all duration-300 hover:text-gray-300">
                  We strive for the highest standards in content quality and user experience.
                </p>
              </div>

              <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 transition-all duration-300 hover:border-cyan-500 hover:shadow-xl hover:shadow-cyan-500/10 transform hover:-translate-y-2 hover:scale-105">
                <div className="bg-cyan-500/20 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4 transition-all duration-300 hover:scale-110">
                  <svg className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 transition-all duration-300 hover:text-cyan-400">Accessibility</h3>
                <p className="text-gray-400 transition-all duration-300 hover:text-gray-300">
                  We're committed to making quality education accessible to all backgrounds.
                </p>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-12 transition-all duration-300 hover:text-emerald-400">Meet Our Leadership</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 text-center transition-all duration-300 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10 transform hover:-translate-y-2 hover:scale-105">
                <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <span className="text-3xl">👨‍💻</span>
                </div>
                <h3 className="text-xl font-bold text-white transition-all duration-300 hover:text-emerald-400">Alex Johnson</h3>
                <p className="text-emerald-400 mb-2 transition-all duration-300 hover:text-emerald-300">Founder & CEO</p>
                <p className="text-gray-400 text-sm transition-all duration-300 hover:text-gray-300">
                  Former senior engineer at Google with 10+ years of experience in scalable systems.
                </p>
              </div>

              <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 text-center transition-all duration-300 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 transform hover:-translate-y-2 hover:scale-105">
                <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <span className="text-3xl">👩‍🔬</span>
                </div>
                <h3 className="text-xl font-bold text-white transition-all duration-300 hover:text-blue-400">Sarah Chen</h3>
                <p className="text-blue-400 mb-2 transition-all duration-300 hover:text-blue-300">Head of AI & Research</p>
                <p className="text-gray-400 text-sm transition-all duration-300 hover:text-gray-300">
                  PhD in Machine Learning from Stanford, specializing in educational AI.
                </p>
              </div>

              <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 text-center transition-all duration-300 hover:border-purple-500 hover:shadow-xl hover:shadow-purple-500/10 transform hover:-translate-y-2 hover:scale-105">
                <div className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <span className="text-3xl">👨‍🏫</span>
                </div>
                <h3 className="text-xl font-bold text-white transition-all duration-300 hover:text-purple-400">Michael Rodriguez</h3>
                <p className="text-purple-400 mb-2 transition-all duration-300 hover:text-purple-300">Chief Learning Officer</p>
                <p className="text-gray-400 text-sm transition-all duration-300 hover:text-gray-300">
                  Former university professor with expertise in curriculum design and pedagogy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;