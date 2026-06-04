import React from "react";
import Navbar from "./Navbar";

const Layout = ({ children, showNavbar = true, showFooter = true }) => {
    return (
        <div className="min-h-screen xalora-grid-bg flex flex-col">
            {showNavbar && <Navbar />}
            <main className="flex-grow">
                {children}
            </main>
            {showFooter && (
                <footer className="xalora-grid-bg border-t-2 border-indigo-600 text-gray-600">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                        {/* Main footer content */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
                            {/* Brand section */}
                            <div className="lg:col-span-5">
                                <div className="flex items-center gap-3 mb-5">
                                    <span className="text-2xl font-black text-indigo-600 tracking-tight">xalora</span>
                                </div>
                                <p className="text-gray-500 mb-6 max-w-md leading-relaxed text-sm">
                                    Revolutionizing coding education with AI-powered learning.{" "}
                                    <span className="text-indigo-600 font-medium">Master algorithms</span>,{" "}
                                    <span className="text-purple-600 font-medium">ace interviews</span>, and{" "}
                                    <span className="text-violet-600 font-medium">build your future</span>.
                                </p>

                                {/* Newsletter signup */}
                                <div className="mb-6">
                                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Stay Updated</h4>
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            className="flex-1 px-4 py-2.5 bg-white/70 border border-indigo-100 rounded-xl text-gray-800 text-sm placeholder-gray-400 focus:outline-none focus:border-indigo-400 focus:bg-white transition-all duration-200"
                                        />
                                        <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all duration-200">
                                            Subscribe
                                        </button>
                                    </div>
                                </div>

                                {/* Social links */}
                                <div className="flex gap-3">
                                    {[
                                        {
                                            href: "https://twitter.com/xalora_ai",
                                            label: "Twitter",
                                            icon: (
                                                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                            )
                                        },
                                        {
                                            href: "https://github.com/Ravi62026/xalora",
                                            label: "GitHub",
                                            icon: (
                                                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                            )
                                        },
                                        {
                                            href: "https://linkedin.com/company/xalora",
                                            label: "LinkedIn",
                                            icon: (
                                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                            )
                                        },
                                        {
                                            href: "https://instagram.com/xalora.ai",
                                            label: "Instagram",
                                            icon: (
                                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                            )
                                        },
                                    ].map(({ href, label, icon }) => (
                                        <a
                                            key={href}
                                            href={href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={`Xalora on ${label}`}
                                            className="group p-2.5 bg-gray-50 border border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200"
                                        >
                                            <svg className="h-4 w-4 text-gray-500 group-hover:text-indigo-600 transition-colors duration-200" fill="currentColor" viewBox="0 0 24 24">
                                                {icon}
                                            </svg>
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Navigation columns */}
                            <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-8">
                                {[
                                    {
                                        title: "Platform", emoji: "🚀",
                                        links: [
                                            { href: "/problems", label: "Problems" },
                                            { href: "/quiz", label: "Quizzes" },
                                            { href: "/internships", label: "Internships" },
                                            { href: "https://www.resume.xalora.one", label: "Resume AI" },
                                            { href: "/pricing", label: "Pricing" },
                                        ]
                                    },
                                    {
                                        title: "Learn", emoji: "🎯",
                                        links: [
                                            { href: "/algorithms", label: "Algorithms" },
                                            { href: "/data-structures", label: "Data Structures" },
                                            { href: "/system-design", label: "System Design" },
                                            { href: "/interview-prep", label: "Interview Prep" },
                                            { href: "/roadmap", label: "Roadmaps" },
                                        ]
                                    },
                                    {
                                        title: "Company", emoji: "🏢",
                                        links: [
                                            { href: "/about", label: "About Us" },
                                            { href: "/careers", label: "Careers" },
                                            { href: "/blog", label: "Blog" },
                                            { href: "#", label: "Press" },
                                        ]
                                    },
                                    {
                                        title: "Support", emoji: "🛡️",
                                        links: [
                                            { href: "/help-center", label: "Help Center" },
                                            { href: "/contact", label: "Contact Us" },
                                            { href: "/community", label: "Community" },
                                            { href: "/status", label: "Status" },
                                        ]
                                    },
                                ].map(({ title, emoji, links }) => (
                                    <div key={title}>
                                        <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-1.5">
                                            <span>{emoji}</span> {title}
                                        </h3>
                                        <ul className="space-y-2.5">
                                            {links.map(({ href, label }) => (
                                                <li key={href}>
                                                    <a
                                                        href={href}
                                                        className="text-sm text-gray-500 hover:text-indigo-600 transition-colors duration-200 flex items-center gap-1.5 group"
                                                    >
                                                        <span className="w-1 h-1 bg-indigo-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                                        {label}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bottom bar */}
                        <div className="border-t border-indigo-600 pt-8 flex flex-col lg:flex-row justify-between items-center gap-4">
                            <div className="flex flex-col sm:flex-row items-center gap-5">
                                <p className="text-gray-400 text-sm">
                                    © {new Date().getFullYear()} Xalora. All rights reserved.
                                </p>
                                <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                                    <span>Made with</span>
                                    <span className="text-red-400 animate-pulse">❤️</span>
                                    <span>for developers</span>
                                </div>
                            </div>
                            <div className="flex flex-wrap justify-center gap-5">
                                {["Privacy Policy", "Terms of Service", "Cookie Policy", "Security"].map((item) => (
                                    <a key={item} href="#" className="text-gray-400 hover:text-indigo-600 text-sm transition-colors duration-200">
                                        {item}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
};

export default Layout;
