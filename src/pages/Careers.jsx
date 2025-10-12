import React from "react";
import { Layout } from "../components";

const Careers = () => {
  return (
    <Layout showNavbar={true}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 transform transition-all duration-500 hover:scale-105">
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Join Our Team
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto transform transition-all duration-700 hover:text-gray-200">
              Help us revolutionize technical education and empower the next generation of developers
            </p>
          </div>

          {/* Why Join Section */}
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl border border-gray-700 p-8 mb-12 transition-all duration-300 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10">
            <h2 className="text-3xl font-bold text-white mb-6 text-center transition-all duration-300 hover:text-emerald-400">Why Xalora?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-emerald-400 mb-4 transition-all duration-300 hover:text-emerald-300">Mission-Driven Work</h3>
                <p className="text-gray-300 mb-6 transition-all duration-300 hover:text-gray-200">
                  Be part of a team that's genuinely changing how people learn to code. Your work directly 
                  impacts thousands of students worldwide on their journey to becoming skilled developers.
                </p>
                
                <h3 className="text-xl font-bold text-blue-400 mb-4 transition-all duration-300 hover:text-blue-300">Cutting-Edge Technology</h3>
                <p className="text-gray-300 mb-6 transition-all duration-300 hover:text-gray-200">
                  Work with the latest AI technologies, cloud infrastructure, and educational platforms. 
                  We're constantly innovating to create better learning experiences.
                </p>
                
                <h3 className="text-xl font-bold text-purple-400 mb-4 transition-all duration-300 hover:text-purple-300">Continuous Learning</h3>
                <p className="text-gray-300 transition-all duration-300 hover:text-gray-200">
                  We invest in your growth with learning stipends, conference attendance, and dedicated 
                  time for personal projects and skill development.
                </p>
              </div>
              <div>
                <div className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-2xl p-6 border border-emerald-500/20 h-full transition-all duration-300 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/20">
                  <h3 className="text-xl font-bold text-white mb-4 transition-all duration-300 hover:text-emerald-400">Our Benefits</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start group">
                      <svg className="h-5 w-5 text-emerald-400 mr-3 mt-0.5 transition-all duration-300 group-hover:text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300 transition-all duration-300 group-hover:text-gray-200">Competitive salary and equity package</span>
                    </li>
                    <li className="flex items-start group">
                      <svg className="h-5 w-5 text-emerald-400 mr-3 mt-0.5 transition-all duration-300 group-hover:text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300 transition-all duration-300 group-hover:text-gray-200">Flexible work arrangements (remote/hybrid)</span>
                    </li>
                    <li className="flex items-start group">
                      <svg className="h-5 w-5 text-emerald-400 mr-3 mt-0.5 transition-all duration-300 group-hover:text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300 transition-all duration-300 group-hover:text-gray-200">Comprehensive health, dental, and vision insurance</span>
                    </li>
                    <li className="flex items-start group">
                      <svg className="h-5 w-5 text-emerald-400 mr-3 mt-0.5 transition-all duration-300 group-hover:text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300 transition-all duration-300 group-hover:text-gray-200">Generous PTO and parental leave policies</span>
                    </li>
                    <li className="flex items-start group">
                      <svg className="h-5 w-5 text-emerald-400 mr-3 mt-0.5 transition-all duration-300 group-hover:text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300 transition-all duration-300 group-hover:text-gray-200">Learning stipend ($1,500/year)</span>
                    </li>
                    <li className="flex items-start group">
                      <svg className="h-5 w-5 text-emerald-400 mr-3 mt-0.5 transition-all duration-300 group-hover:text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300 transition-all duration-300 group-hover:text-gray-200">Latest equipment and tools</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Open Positions */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-12 transition-all duration-300 hover:text-emerald-400">Open Positions</h2>
            <div className="space-y-6">
              {/* Engineering Positions */}
              <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden transition-all duration-300 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10">
                <div className="p-6 border-b border-gray-700">
                  <h3 className="text-2xl font-bold text-white transition-all duration-300 hover:text-emerald-400">Engineering</h3>
                </div>
                <div className="p-6 space-y-6">
                  <div className="bg-gray-700/30 rounded-xl p-5 transition-all duration-300 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10 border border-transparent transform hover:-translate-y-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-xl font-bold text-white transition-all duration-300 hover:text-emerald-400">Senior Full Stack Engineer</h4>
                        <p className="text-gray-400 transition-all duration-300 hover:text-gray-300">Remote · Engineering</p>
                      </div>
                      <button className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg font-medium text-white hover:from-emerald-500 hover:to-teal-500 transition-all duration-300 transform hover:scale-105 whitespace-nowrap">
                        Apply Now
                      </button>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-emerald-900/50 text-emerald-300 text-sm rounded-full transition-all duration-300 hover:bg-emerald-800 hover:scale-105">React</span>
                      <span className="px-3 py-1 bg-blue-900/50 text-blue-300 text-sm rounded-full transition-all duration-300 hover:bg-blue-800 hover:scale-105">Node.js</span>
                      <span className="px-3 py-1 bg-purple-900/50 text-purple-300 text-sm rounded-full transition-all duration-300 hover:bg-purple-800 hover:scale-105">MongoDB</span>
                      <span className="px-3 py-1 bg-cyan-900/50 text-cyan-300 text-sm rounded-full transition-all duration-300 hover:bg-cyan-800 hover:scale-105">AWS</span>
                    </div>
                  </div>

                  <div className="bg-gray-700/30 rounded-xl p-5 transition-all duration-300 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 border border-transparent transform hover:-translate-y-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-xl font-bold text-white transition-all duration-300 hover:text-blue-400">AI/ML Engineer</h4>
                        <p className="text-gray-400 transition-all duration-300 hover:text-gray-300">Remote · Engineering</p>
                      </div>
                      <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg font-medium text-white hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 transform hover:scale-105 whitespace-nowrap">
                        Apply Now
                      </button>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-emerald-900/50 text-emerald-300 text-sm rounded-full transition-all duration-300 hover:bg-emerald-800 hover:scale-105">Python</span>
                      <span className="px-3 py-1 bg-blue-900/50 text-blue-300 text-sm rounded-full transition-all duration-300 hover:bg-blue-800 hover:scale-105">TensorFlow</span>
                      <span className="px-3 py-1 bg-purple-900/50 text-purple-300 text-sm rounded-full transition-all duration-300 hover:bg-purple-800 hover:scale-105">PyTorch</span>
                      <span className="px-3 py-1 bg-cyan-900/50 text-cyan-300 text-sm rounded-full transition-all duration-300 hover:bg-cyan-800 hover:scale-105">NLP</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product & Design Positions */}
              <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden transition-all duration-300 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10">
                <div className="p-6 border-b border-gray-700">
                  <h3 className="text-2xl font-bold text-white transition-all duration-300 hover:text-emerald-400">Product & Design</h3>
                </div>
                <div className="p-6 space-y-6">
                  <div className="bg-gray-700/30 rounded-xl p-5 transition-all duration-300 hover:border-purple-500 hover:shadow-xl hover:shadow-purple-500/10 border border-transparent transform hover:-translate-y-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-xl font-bold text-white transition-all duration-300 hover:text-purple-400">Product Manager</h4>
                        <p className="text-gray-400 transition-all duration-300 hover:text-gray-300">Remote · Product</p>
                      </div>
                      <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg font-medium text-white hover:from-purple-500 hover:to-indigo-500 transition-all duration-300 transform hover:scale-105 whitespace-nowrap">
                        Apply Now
                      </button>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-emerald-900/50 text-emerald-300 text-sm rounded-full transition-all duration-300 hover:bg-emerald-800 hover:scale-105">Strategy</span>
                      <span className="px-3 py-1 bg-blue-900/50 text-blue-300 text-sm rounded-full transition-all duration-300 hover:bg-blue-800 hover:scale-105">Analytics</span>
                      <span className="px-3 py-1 bg-purple-900/50 text-purple-300 text-sm rounded-full transition-all duration-300 hover:bg-purple-800 hover:scale-105">Roadmapping</span>
                    </div>
                  </div>

                  <div className="bg-gray-700/30 rounded-xl p-5 transition-all duration-300 hover:border-cyan-500 hover:shadow-xl hover:shadow-cyan-500/10 border border-transparent transform hover:-translate-y-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-xl font-bold text-white transition-all duration-300 hover:text-cyan-400">UX/UI Designer</h4>
                        <p className="text-gray-400 transition-all duration-300 hover:text-gray-300">Remote · Design</p>
                      </div>
                      <button className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg font-medium text-white hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 whitespace-nowrap">
                        Apply Now
                      </button>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-emerald-900/50 text-emerald-300 text-sm rounded-full transition-all duration-300 hover:bg-emerald-800 hover:scale-105">Figma</span>
                      <span className="px-3 py-1 bg-blue-900/50 text-blue-300 text-sm rounded-full transition-all duration-300 hover:bg-blue-800 hover:scale-105">Prototyping</span>
                      <span className="px-3 py-1 bg-purple-900/50 text-purple-300 text-sm rounded-full transition-all duration-300 hover:bg-purple-800 hover:scale-105">User Research</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content & Education Positions */}
              <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden transition-all duration-300 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10">
                <div className="p-6 border-b border-gray-700">
                  <h3 className="text-2xl font-bold text-white transition-all duration-300 hover:text-emerald-400">Content & Education</h3>
                </div>
                <div className="p-6 space-y-6">
                  <div className="bg-gray-700/30 rounded-xl p-5 transition-all duration-300 hover:border-teal-500 hover:shadow-xl hover:shadow-teal-500/10 border border-transparent transform hover:-translate-y-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-xl font-bold text-white transition-all duration-300 hover:text-teal-400">Curriculum Developer</h4>
                        <p className="text-gray-400 transition-all duration-300 hover:text-gray-300">Remote · Education</p>
                      </div>
                      <button className="px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-lg font-medium text-white hover:from-teal-500 hover:to-emerald-500 transition-all duration-300 transform hover:scale-105 whitespace-nowrap">
                        Apply Now
                      </button>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-emerald-900/50 text-emerald-300 text-sm rounded-full transition-all duration-300 hover:bg-emerald-800 hover:scale-105">DSA</span>
                      <span className="px-3 py-1 bg-blue-900/50 text-blue-300 text-sm rounded-full transition-all duration-300 hover:bg-blue-800 hover:scale-105">System Design</span>
                      <span className="px-3 py-1 bg-purple-900/50 text-purple-300 text-sm rounded-full transition-all duration-300 hover:bg-purple-800 hover:scale-105">Pedagogy</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Diversity & Inclusion */}
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl border border-gray-700 p-8 mb-12 transition-all duration-300 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10">
            <h2 className="text-3xl font-bold text-white mb-6 text-center transition-all duration-300 hover:text-emerald-400">Diversity & Inclusion</h2>
            <p className="text-gray-300 text-center max-w-3xl mx-auto transition-all duration-300 hover:text-gray-200">
              We believe that diverse teams build better products. Xalora is committed to creating an inclusive 
              environment where people from all backgrounds can thrive. We actively encourage applications from 
              underrepresented groups in tech.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Careers;