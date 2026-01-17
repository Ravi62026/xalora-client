import React from "react";
import { Layout } from "../components";

const Careers = () => {
  return (
    <Layout showNavbar={true}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in pt-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 transform transition-all duration-500 hover:scale-105">
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Join Our Team
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Help us revolutionize technical education and empower the next generation of developers
            </p>
          </div>

          {/* Why Join Section */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-8 sm:p-12 mb-16 shadow-2xl transition-all duration-300 hover:border-emerald-500/30">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-10 text-center">Why Xalora?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              <div className="space-y-8">
                <div className="bg-white/5 rounded-2xl p-6 border border-white/5 hover:border-emerald-500/30 transition-all group">
                  <h3 className="text-xl font-bold text-emerald-400 mb-3 group-hover:text-emerald-300">Mission-Driven Work</h3>
                  <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                    Be part of a team that's genuinely changing how people learn to code. Your work directly
                    impacts thousands of students worldwide on their journey to becoming skilled developers.
                  </p>
                </div>

                <div className="bg-white/5 rounded-2xl p-6 border border-white/5 hover:border-blue-500/30 transition-all group">
                  <h3 className="text-xl font-bold text-blue-400 mb-3 group-hover:text-blue-300">Cutting-Edge Technology</h3>
                  <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                    Work with the latest AI technologies, cloud infrastructure, and educational platforms.
                    We're constantly innovating to create better learning experiences.
                  </p>
                </div>

                <div className="bg-white/5 rounded-2xl p-6 border border-white/5 hover:border-purple-500/30 transition-all group">
                  <h3 className="text-xl font-bold text-purple-400 mb-3 group-hover:text-purple-300">Continuous Learning</h3>
                  <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                    We invest in your growth with learning stipends, conference attendance, and dedicated
                    time for personal projects and skill development.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-900/20 to-cyan-900/20 rounded-3xl p-8 border border-emerald-500/20 h-full">
                <h3 className="text-2xl font-bold text-white mb-6">Our Benefits</h3>
                <ul className="space-y-5">
                  <li className="flex items-start group">
                    <div className="p-2 bg-emerald-500/10 rounded-lg mr-4 group-hover:bg-emerald-500/20 transition-colors">
                      <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-300 font-medium py-1">Competitive salary and equity package</span>
                  </li>
                  <li className="flex items-start group">
                    <div className="p-2 bg-emerald-500/10 rounded-lg mr-4 group-hover:bg-emerald-500/20 transition-colors">
                      <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-300 font-medium py-1">Flexible work arrangements (remote/hybrid)</span>
                  </li>
                  <li className="flex items-start group">
                    <div className="p-2 bg-emerald-500/10 rounded-lg mr-4 group-hover:bg-emerald-500/20 transition-colors">
                      <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-300 font-medium py-1">Comprehensive health, dental, and vision insurance</span>
                  </li>
                  <li className="flex items-start group">
                    <div className="p-2 bg-emerald-500/10 rounded-lg mr-4 group-hover:bg-emerald-500/20 transition-colors">
                      <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-300 font-medium py-1">Generous PTO and parental leave policies</span>
                  </li>
                  <li className="flex items-start group">
                    <div className="p-2 bg-emerald-500/10 rounded-lg mr-4 group-hover:bg-emerald-500/20 transition-colors">
                      <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-300 font-medium py-1">Learning stipend ($1,500/year)</span>
                  </li>
                  <li className="flex items-start group">
                    <div className="p-2 bg-emerald-500/10 rounded-lg mr-4 group-hover:bg-emerald-500/20 transition-colors">
                      <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-300 font-medium py-1">Latest equipment and tools</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Open Positions */}
          <div className="mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-12">Open Positions</h2>
            <div className="space-y-6">
              {/* Engineering Positions */}
              <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden">
                <div className="p-6 border-b border-white/10 bg-white/5">
                  <h3 className="text-2xl font-bold text-white">Engineering</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/5 hover:border-emerald-500/30 hover:bg-white/10 transition-all group">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-xl font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">Senior Full Stack Engineer</h4>
                        <p className="text-gray-400 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          Remote · Engineering
                        </p>
                      </div>
                      <button className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl font-medium text-white hover:from-emerald-500 hover:to-teal-500 transition-all shadow-lg shadow-emerald-900/20 whitespace-nowrap">
                        Apply Now
                      </button>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-emerald-900/30 text-emerald-300 border border-emerald-500/30 text-xs sm:text-sm rounded-full">React</span>
                      <span className="px-3 py-1 bg-blue-900/30 text-blue-300 border border-blue-500/30 text-xs sm:text-sm rounded-full">Node.js</span>
                      <span className="px-3 py-1 bg-purple-900/30 text-purple-300 border border-purple-500/30 text-xs sm:text-sm rounded-full">MongoDB</span>
                      <span className="px-3 py-1 bg-cyan-900/30 text-cyan-300 border border-cyan-500/30 text-xs sm:text-sm rounded-full">AWS</span>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-6 border border-white/5 hover:border-blue-500/30 hover:bg-white/10 transition-all group">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">AI/ML Engineer</h4>
                        <p className="text-gray-400 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                          Remote · Engineering
                        </p>
                      </div>
                      <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl font-medium text-white hover:from-blue-500 hover:to-cyan-500 transition-all shadow-lg shadow-blue-900/20 whitespace-nowrap">
                        Apply Now
                      </button>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-emerald-900/30 text-emerald-300 border border-emerald-500/30 text-xs sm:text-sm rounded-full">Python</span>
                      <span className="px-3 py-1 bg-blue-900/30 text-blue-300 border border-blue-500/30 text-xs sm:text-sm rounded-full">TensorFlow</span>
                      <span className="px-3 py-1 bg-purple-900/30 text-purple-300 border border-purple-500/30 text-xs sm:text-sm rounded-full">PyTorch</span>
                      <span className="px-3 py-1 bg-cyan-900/30 text-cyan-300 border border-cyan-500/30 text-xs sm:text-sm rounded-full">NLP</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product & Design Positions */}
              <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden">
                <div className="p-6 border-b border-white/10 bg-white/5">
                  <h3 className="text-2xl font-bold text-white">Product & Design</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/5 hover:border-purple-500/30 hover:bg-white/10 transition-all group">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-xl font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">Product Manager</h4>
                        <p className="text-gray-400 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                          Remote · Product
                        </p>
                      </div>
                      <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl font-medium text-white hover:from-purple-500 hover:to-indigo-500 transition-all shadow-lg shadow-purple-900/20 whitespace-nowrap">
                        Apply Now
                      </button>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-emerald-900/30 text-emerald-300 border border-emerald-500/30 text-xs sm:text-sm rounded-full">Strategy</span>
                      <span className="px-3 py-1 bg-blue-900/30 text-blue-300 border border-blue-500/30 text-xs sm:text-sm rounded-full">Analytics</span>
                      <span className="px-3 py-1 bg-purple-900/30 text-purple-300 border border-purple-500/30 text-xs sm:text-sm rounded-full">Roadmapping</span>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-6 border border-white/5 hover:border-cyan-500/30 hover:bg-white/10 transition-all group">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">UX/UI Designer</h4>
                        <p className="text-gray-400 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                          Remote · Design
                        </p>
                      </div>
                      <button className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-medium text-white hover:from-cyan-500 hover:to-blue-500 transition-all shadow-lg shadow-cyan-900/20 whitespace-nowrap">
                        Apply Now
                      </button>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-emerald-900/30 text-emerald-300 border border-emerald-500/30 text-xs sm:text-sm rounded-full">Figma</span>
                      <span className="px-3 py-1 bg-blue-900/30 text-blue-300 border border-blue-500/30 text-xs sm:text-sm rounded-full">Prototyping</span>
                      <span className="px-3 py-1 bg-purple-900/30 text-purple-300 border border-purple-500/30 text-xs sm:text-sm rounded-full">User Research</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content & Education Positions */}
              <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden">
                <div className="p-6 border-b border-white/10 bg-white/5">
                  <h3 className="text-2xl font-bold text-white">Content & Education</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/5 hover:border-teal-500/30 hover:bg-white/10 transition-all group">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-xl font-bold text-white mb-1 group-hover:text-teal-400 transition-colors">Curriculum Developer</h4>
                        <p className="text-gray-400 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                          Remote · Education
                        </p>
                      </div>
                      <button className="px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-xl font-medium text-white hover:from-teal-500 hover:to-emerald-500 transition-all shadow-lg shadow-teal-900/20 whitespace-nowrap">
                        Apply Now
                      </button>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-emerald-900/30 text-emerald-300 border border-emerald-500/30 text-xs sm:text-sm rounded-full">DSA</span>
                      <span className="px-3 py-1 bg-blue-900/30 text-blue-300 border border-blue-500/30 text-xs sm:text-sm rounded-full">System Design</span>
                      <span className="px-3 py-1 bg-purple-900/30 text-purple-300 border border-purple-500/30 text-xs sm:text-sm rounded-full">Pedagogy</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Diversity & Inclusion */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-8 sm:p-12 mb-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none"></div>

            <h2 className="text-3xl font-bold text-white mb-6 relative z-10">Diversity & Inclusion</h2>
            <p className="text-gray-300 max-w-3xl mx-auto leading-relaxed text-lg relative z-10">
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