import React from "react";
import Navbar from "./Navbar";

const Layout = ({ children, showNavbar = true }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex flex-col">
            {showNavbar && <Navbar />}
            <main className={`flex-grow ${showNavbar ? "" : "pt-0"}`}>
                {children}
            </main>
            <footer className="bg-gradient-to-br from-black via-gray-900 to-slate-900 text-white relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-r from-lime-500/10 to-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    {/* Main footer content */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
                        {/* Brand section */}
                        <div className="lg:col-span-5">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="relative">
                                    <img
                                        src="/logo_xalora.png"
                                        alt="Xalora"
                                        className="h-35 w-auto"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-lg animate-pulse"></div>
                                </div>
                                <span className="text-2xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                                    XALORA
                                </span>
                            </div>
                            <p className="text-white/70 mb-8 max-w-md text-lg leading-relaxed">
                                Revolutionizing coding education with AI-powered learning. 
                                <span className="text-emerald-300"> Master algorithms</span>, 
                                <span className="text-teal-300"> ace interviews</span>, and 
                                <span className="text-cyan-300"> build your future</span>.
                            </p>
                            
                            {/* Newsletter signup */}
                            <div className="mb-8">
                                <h4 className="text-lg font-semibold text-white mb-4">Stay Updated</h4>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-emerald-400/50 focus:bg-white/15 transition-all duration-300"
                                    />
                                    <button className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl text-white font-semibold hover:from-emerald-500 hover:to-teal-500 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-emerald-500/25">
                                        Subscribe
                                    </button>
                                </div>
                            </div>

                            {/* Social links */}
                            <div className="flex space-x-4">
                                <a href="#" className="group p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:border-emerald-400/50 hover:bg-emerald-400/10 transition-all duration-300">
                                    <svg className="h-5 w-5 text-white/70 group-hover:text-emerald-400 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                    </svg>
                                </a>
                                <a href="#" className="group p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:border-emerald-400/50 hover:bg-emerald-400/10 transition-all duration-300">
                                    <svg className="h-5 w-5 text-white/70 group-hover:text-emerald-400 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                    </svg>
                                </a>
                                <a href="#" className="group p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:border-emerald-400/50 hover:bg-emerald-400/10 transition-all duration-300">
                                    <svg className="h-5 w-5 text-white/70 group-hover:text-emerald-400 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                    </svg>
                                </a>
                                <a href="#" className="group p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:border-emerald-400/50 hover:bg-emerald-400/10 transition-all duration-300">
                                    <svg className="h-5 w-5 text-white/70 group-hover:text-emerald-400 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                    </svg>
                                </a>
                            </div>
                        </div>
                        
                        {/* Navigation columns */}
                        <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-8">
                            <div>
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                    <span className="text-emerald-400">🚀</span>
                                    Platform
                                </h3>
                                <ul className="space-y-3">
                                    <li><a href="/problems" className="text-white/70 hover:text-emerald-400 transition-colors duration-300 flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                        Problems
                                    </a></li>
                                    <li><a href="/quiz" className="text-white/70 hover:text-emerald-400 transition-colors duration-300 flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                        Quizzes
                                    </a></li>
                                    <li><a href="/internships" className="text-white/70 hover:text-emerald-400 transition-colors duration-300 flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                        Internships
                                    </a></li>
                                    <li><a href="/resume-ai" className="text-white/70 hover:text-emerald-400 transition-colors duration-300 flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                        Resume AI
                                    </a></li>
                                    <li><a href="/pricing" className="text-white/70 hover:text-emerald-400 transition-colors duration-300 flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                        Pricing
                                    </a></li>
                                </ul>
                            </div>
                            
                            <div>
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                    <span className="text-teal-400">🎯</span>
                                    Learn
                                </h3>
                                <ul className="space-y-3">
                                    <li><a href="/algorithms" className="text-white/70 hover:text-teal-400 transition-colors duration-300 flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-teal-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                        Algorithms
                                    </a></li>
                                    <li><a href="/data-structures" className="text-white/70 hover:text-teal-400 transition-colors duration-300 flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-teal-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                        Data Structures
                                    </a></li>
                                    <li><a href="/system-design" className="text-white/70 hover:text-teal-400 transition-colors duration-300 flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-teal-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                        System Design
                                    </a></li>
                                    <li><a href="/interview-prep" className="text-white/70 hover:text-teal-400 transition-colors duration-300 flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-teal-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                        Interview Prep
                                    </a></li>
                                    <li><a href="/roadmap" className="text-white/70 hover:text-teal-400 transition-colors duration-300 flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-teal-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
Learning Roadmaps
                                    </a></li>
                                </ul>
                            </div>
                            
                            <div>
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                    <span className="text-cyan-400">🏢</span>
                                    Company
                                </h3>
                                <ul className="space-y-3">
                                    <li><a href="/about" className="text-white/70 hover:text-cyan-400 transition-colors duration-300 flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                        About Us
                                    </a></li>
                                    <li><a href="/careers" className="text-white/70 hover:text-cyan-400 transition-colors duration-300 flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                        Careers
                                    </a></li>
                                    <li><a href="/blog" className="text-white/70 hover:text-cyan-400 transition-colors duration-300 flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                        Blog
                                    </a></li>
                                    <li><a href="#" className="text-white/70 hover:text-cyan-400 transition-colors duration-300 flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                        Press
                                    </a></li>
                                </ul>
                            </div>
                            
                            <div>
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                    <span className="text-lime-400">🛡️</span>
                                    Support
                                </h3>
                                <ul className="space-y-3">
                                    <li><a href="/help-center" className="text-white/70 hover:text-lime-400 transition-colors duration-300 flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-lime-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                        Help Center
                                    </a></li>
                                    <li><a href="/contact" className="text-white/70 hover:text-lime-400 transition-colors duration-300 flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-lime-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                        Contact Us
                                    </a></li>
                                    <li><a href="/community" className="text-white/70 hover:text-lime-400 transition-colors duration-300 flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-lime-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                        Community
                                    </a></li>
                                    <li><a href="/status" className="text-white/70 hover:text-lime-400 transition-colors duration-300 flex items-center gap-2 group">
                                        <span className="w-1 h-1 bg-lime-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                        Status
                                    </a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    {/* Bottom section */}
                    <div className="border-t border-white/10 pt-8 flex flex-col lg:flex-row justify-between items-center gap-6">
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            <p className="text-white/60 text-sm">
                                © {new Date().getFullYear()} Xalora. All rights reserved.
                            </p>
                            <div className="flex items-center gap-2 text-white/60 text-sm">
                                <span>Made with</span>
                                <span className="text-red-400 animate-pulse">❤️</span>
                                <span>for developers</span>
                            </div>
                        </div>
                        <div className="flex flex-wrap justify-center gap-6">
                            <a href="#" className="text-white/60 hover:text-emerald-400 text-sm transition-colors duration-300">Privacy Policy</a>
                            <a href="#" className="text-white/60 hover:text-emerald-400 text-sm transition-colors duration-300">Terms of Service</a>
                            <a href="#" className="text-white/60 hover:text-emerald-400 text-sm transition-colors duration-300">Cookie Policy</a>
                            <a href="#" className="text-white/60 hover:text-emerald-400 text-sm transition-colors duration-300">Security</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;