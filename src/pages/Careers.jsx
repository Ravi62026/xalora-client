import React from "react";
import { Layout } from "../components";

const Careers = () => {
  return (
    <Layout showNavbar={true}>
      <div className="min-h-screen xalora-grid-bg py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in pt-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 mb-6 transform transition-all duration-500 hover:scale-105">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Join Our Team
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Help us revolutionize technical education and empower the next generation of developers
            </p>
          </div>

          {/* Why Join Section */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200 p-8 sm:p-12 mb-16 shadow-sm">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-10 text-center">Why Xalora?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              <div className="space-y-8">
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/60 transition-all group hover:border-indigo-500/20">
                  <h3 className="text-xl font-bold text-emerald-600 mb-3">Mission-Driven Work</h3>
                  <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                    Be part of a team that's genuinely changing how people learn to code. Your work directly
                    impacts thousands of students worldwide on their journey to becoming skilled developers.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/60 transition-all group hover:border-indigo-500/20">
                  <h3 className="text-xl font-bold text-blue-600 mb-3">Cutting-Edge Technology</h3>
                  <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                    Work with the latest AI technologies, cloud infrastructure, and educational platforms.
                    We're constantly innovating to create better learning experiences.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/60 transition-all group hover:border-indigo-500/20">
                  <h3 className="text-xl font-bold text-purple-600 mb-3">Continuous Learning</h3>
                  <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                    We invest in your growth with learning stipends, conference attendance, and dedicated
                    time for personal projects and skill development.
                  </p>
                </div>
              </div>

              <div className="bg-emerald-50/50 rounded-3xl p-8 border border-emerald-100 h-full">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Our Benefits</h3>
                <ul className="space-y-5">
                  <li className="flex items-start group">
                    <div className="p-2 bg-emerald-100 rounded-lg mr-4 transition-colors">
                      <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-slate-700 font-semibold py-1">Competitive salary and equity package</span>
                  </li>
                  <li className="flex items-start group">
                    <div className="p-2 bg-emerald-100 rounded-lg mr-4 transition-colors">
                      <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-slate-700 font-semibold py-1">Flexible work arrangements (remote/hybrid)</span>
                  </li>
                  <li className="flex items-start group">
                    <div className="p-2 bg-emerald-100 rounded-lg mr-4 transition-colors">
                      <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-slate-700 font-semibold py-1">Comprehensive health, dental, and vision insurance</span>
                  </li>
                  <li className="flex items-start group">
                    <div className="p-2 bg-emerald-100 rounded-lg mr-4 transition-colors">
                      <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-slate-700 font-semibold py-1">Generous PTO and parental leave policies</span>
                  </li>
                  <li className="flex items-start group">
                    <div className="p-2 bg-emerald-100 rounded-lg mr-4 transition-colors">
                      <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-slate-700 font-semibold py-1">Learning stipend ($1,500/year)</span>
                  </li>
                  <li className="flex items-start group">
                    <div className="p-2 bg-emerald-100 rounded-lg mr-4 transition-colors">
                      <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-slate-700 font-semibold py-1">Latest equipment and tools</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Open Positions */}
          <div className="mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 text-center mb-12">Open Positions</h2>
            <div className="space-y-6">
              {/* Engineering Positions */}
              <div className="bg-white/80 rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 bg-slate-50">
                  <h3 className="text-2xl font-bold text-slate-900">Engineering</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/50 hover:border-indigo-500/20 hover:bg-white/60 transition-all group">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">Senior Full Stack Engineer</h4>
                        <p className="text-slate-500 flex items-center gap-2 text-sm font-medium">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                          Remote · Engineering
                        </p>
                      </div>
                      <button className="px-6 py-3 bg-indigo-600 rounded-xl font-bold text-white hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 whitespace-nowrap">
                        Apply Now
                      </button>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs sm:text-sm rounded-full font-semibold">React</span>
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 text-xs sm:text-sm rounded-full font-semibold">Node.js</span>
                      <span className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-100 text-xs sm:text-sm rounded-full font-semibold">MongoDB</span>
                      <span className="px-3 py-1 bg-cyan-50 text-cyan-700 border border-cyan-100 text-xs sm:text-sm rounded-full font-semibold">AWS</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/50 hover:border-indigo-500/20 hover:bg-white/60 transition-all group">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">AI/ML Engineer</h4>
                        <p className="text-slate-500 flex items-center gap-2 text-sm font-medium">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                          Remote · Engineering
                        </p>
                      </div>
                      <button className="px-6 py-3 bg-indigo-600 rounded-xl font-bold text-white hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 whitespace-nowrap">
                        Apply Now
                      </button>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs sm:text-sm rounded-full font-semibold">Python</span>
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 text-xs sm:text-sm rounded-full font-semibold">TensorFlow</span>
                      <span className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-100 text-xs sm:text-sm rounded-full font-semibold">PyTorch</span>
                      <span className="px-3 py-1 bg-cyan-50 text-cyan-700 border border-cyan-100 text-xs sm:text-sm rounded-full font-semibold">NLP</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product & Design Positions */}
              <div className="bg-white/80 rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 bg-slate-50">
                  <h3 className="text-2xl font-bold text-slate-900">Product & Design</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/50 hover:border-indigo-500/20 hover:bg-white/60 transition-all group">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-purple-600 transition-colors">Product Manager</h4>
                        <p className="text-slate-500 flex items-center gap-2 text-sm font-medium">
                          <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                          Remote · Product
                        </p>
                      </div>
                      <button className="px-6 py-3 bg-indigo-600 rounded-xl font-bold text-white hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 whitespace-nowrap">
                        Apply Now
                      </button>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs sm:text-sm rounded-full font-semibold">Strategy</span>
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 text-xs sm:text-sm rounded-full font-semibold">Analytics</span>
                      <span className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-100 text-xs sm:text-sm rounded-full font-semibold">Roadmapping</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/50 hover:border-indigo-500/20 hover:bg-white/60 transition-all group">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-cyan-600 transition-colors">UX/UI Designer</h4>
                        <p className="text-slate-500 flex items-center gap-2 text-sm font-medium">
                          <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>
                          Remote · Design
                        </p>
                      </div>
                      <button className="px-6 py-3 bg-indigo-600 rounded-xl font-bold text-white hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 whitespace-nowrap">
                        Apply Now
                      </button>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs sm:text-sm rounded-full font-semibold">Figma</span>
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 text-xs sm:text-sm rounded-full font-semibold">Prototyping</span>
                      <span className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-100 text-xs sm:text-sm rounded-full font-semibold">User Research</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content & Education Positions */}
              <div className="bg-white/80 rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 bg-slate-50">
                  <h3 className="text-2xl font-bold text-slate-900">Content & Education</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/50 hover:border-indigo-500/20 hover:bg-white/60 transition-all group">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">Curriculum Developer</h4>
                        <p className="text-slate-500 flex items-center gap-2 text-sm font-medium">
                          <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
                          Remote · Education
                        </p>
                      </div>
                      <button className="px-6 py-3 bg-indigo-600 rounded-xl font-bold text-white hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 whitespace-nowrap">
                        Apply Now
                      </button>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs sm:text-sm rounded-full font-semibold">DSA</span>
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 text-xs sm:text-sm rounded-full font-semibold">System Design</span>
                      <span className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-100 text-xs sm:text-sm rounded-full font-semibold">Pedagogy</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Diversity & Inclusion */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200 p-8 sm:p-12 mb-12 text-center relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100/30 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none"></div>

            <h2 className="text-3xl font-bold text-slate-900 mb-6 relative z-10">Diversity & Inclusion</h2>
            <p className="text-slate-600 max-w-3xl mx-auto leading-relaxed text-lg relative z-10">
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