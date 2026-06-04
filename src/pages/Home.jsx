import React from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "../components";
import HomeJobGenie from "../components/HomeJobGenie";

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 },
};

const Home = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: "🧠",
            title: "AI-Powered Learning",
            desc: "Personalized paths with 50+ LLMs guiding your journey every step of the way.",
            color: "bg-indigo-50 text-indigo-600",
            border: "hover:border-indigo-200",
        },
        {
            icon: "📦",
            title: "DSA Mastery",
            desc: "500+ handpicked problems with detailed solutions, hints, and video explanations.",
            color: "bg-purple-50 text-purple-600",
            border: "hover:border-purple-200",
        },
        {
            icon: "📄",
            title: "Resume AI Builder",
            desc: "ATS-optimized resumes with AI-powered suggestions, scoring, and improvement tips.",
            color: "bg-violet-50 text-violet-600",
            border: "hover:border-violet-200",
        },
        {
            icon: "💬",
            title: "Interview Simulator",
            desc: "Realistic AI mock interviews with instant feedback and performance analysis.",
            color: "bg-blue-50 text-blue-600",
            border: "hover:border-blue-200",
        },
        {
            icon: "💻",
            title: "Coding Playground",
            desc: "Multi-language support with real-time execution, debugging, and test cases.",
            color: "bg-cyan-50 text-cyan-600",
            border: "hover:border-cyan-200",
        },
        {
            icon: "📊",
            title: "Progress Tracking",
            desc: "Detailed analytics, streak tracking, and insights to keep you on the right path.",
            color: "bg-pink-50 text-pink-600",
            border: "hover:border-pink-200",
        },
    ];

    const testimonials = [
        {
            name: "Ananya Sharma",
            role: "Software Engineer @ Google",
            content: "Xalora's AI-powered learning helped me master DSA in just 3 months. The interview simulator was a game-changer for my Google interview prep.",
            avatar: "A",
            avatarBg: "bg-indigo-100 text-indigo-700",
        },
        {
            name: "Rohan Patel",
            role: "SDE @ Amazon",
            content: "The resume builder got me noticed by top recruiters. 500+ DSA problems with detailed solutions made my preparation thorough and effective.",
            avatar: "R",
            avatarBg: "bg-purple-100 text-purple-700",
        },
        {
            name: "Priya Kumar",
            role: "ML Engineer @ Microsoft",
            content: "Access to 50+ LLMs accelerated my learning. The progress tracking feature helped me stay consistent and focused on my goals.",
            avatar: "P",
            avatarBg: "bg-violet-100 text-violet-700",
        },
    ];

    return (
        <Layout>
            {/* ── Hero ── */}
            <section className="relative min-h-[90vh] flex items-center justify-center px-6 overflow-hidden">
                {/* Decorative blobs */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-100/60 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-100/50 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

                <div className="relative z-10 max-w-5xl mx-auto text-center">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-600 px-4 py-1.5 rounded-full text-sm font-semibold mb-8"
                    >
                        <span>🚀</span> The All-in-One CS Learning Platform
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.08] tracking-tight mb-6"
                    >
                        Transform Your{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                            Coding
                        </span>{" "}
                        Journey
                    </motion.h1>

                    {/* Subheadline */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.25 }}
                        className="text-xl text-gray-500 max-w-2xl mx-auto mb-4"
                    >
                        From <span className="text-indigo-600 font-semibold">Hello World</span> to your{" "}
                        <span className="text-purple-600 font-semibold">Dream Job</span> — all in one platform.
                    </motion.p>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.35 }}
                        className="text-base text-gray-400 max-w-xl mx-auto mb-10"
                    >
                        Master DSA, AI interviews, resume building, and access 50+ LLMs — everything a CS engineer needs.
                    </motion.p>

                    {/* CTA buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.45 }}
                        className="flex gap-4 justify-center flex-wrap mb-14"
                    >
                        <Link
                            to="/signup"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-full font-semibold text-base transition-all duration-200 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5"
                        >
                            Get Started Free →
                        </Link>
                        <Link
                            to="/problems"
                            className="border-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 px-8 py-3.5 rounded-full font-semibold text-base transition-all duration-200 hover:-translate-y-0.5"
                        >
                            Explore Problems
                        </Link>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
                    >
                        {[
                            { number: "50+", label: "Topics" },
                            { number: "500+", label: "DSA Problems" },
                            { number: "50+", label: "AI Models" },
                            { number: "10K+", label: "Engineers" },
                        ].map((stat) => (
                            <div
                                key={stat.label}
                                className="bg-white/80 border border-gray-100 rounded-2xl px-4 py-4 text-center shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-200"
                            >
                                <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-1">
                                    {stat.number}
                                </div>
                                <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── Features ── */}
            <section className="py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        className="text-center mb-14"
                        initial="hidden"
                        whileInView="show"
                        variants={fadeUp}
                        transition={{ duration: 0.7 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-600 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
                            ⚡ Powerful Features
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                            Everything You Need to{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                                Land Your Dream Job
                            </span>
                        </h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">
                            One platform. All the tools. Built specifically for CS engineers who want to go from learner to employed.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, i) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.07 }}
                                viewport={{ once: true }}
                                className={`bg-white border border-gray-100 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg ${feature.border} hover:-translate-y-1 cursor-default`}
                            >
                                <div className={`inline-flex p-3 rounded-xl ${feature.color} mb-4 text-2xl`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Job Genie ── */}
            <HomeJobGenie />

            {/* ── Testimonials ── */}
            <section className="py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        className="text-center mb-14"
                        initial="hidden"
                        whileInView="show"
                        variants={fadeUp}
                        transition={{ duration: 0.7 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-100 text-purple-600 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
                            🌟 Success Stories
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                            Join Thousands of{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                                Successful Engineers
                            </span>
                        </h2>
                        <p className="text-gray-500 max-w-xl mx-auto">
                            Real stories from engineers who transformed their careers with Xalora.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {testimonials.map((t, i) => (
                            <motion.div
                                key={t.name}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-white border border-gray-100 rounded-2xl p-7 hover:shadow-lg hover:border-indigo-100 transition-all duration-300 hover:-translate-y-1"
                            >
                                {/* Stars */}
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, s) => (
                                        <span key={s} className="text-amber-400 text-sm">★</span>
                                    ))}
                                </div>
                                <p className="text-gray-600 italic text-sm leading-relaxed mb-6">
                                    "{t.content}"
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full ${t.avatarBg} flex items-center justify-center font-bold text-sm`}>
                                        {t.avatar}
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-900">{t.name}</div>
                                        <div className="text-xs text-gray-500">{t.role}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="py-24 px-6">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                    className="max-w-2xl mx-auto text-center"
                >
                    <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-600 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
                        🎯 Start Today — It's Free
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                        Ready to Transform{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                            Your Career?
                        </span>
                    </h2>
                    <p className="text-gray-500 text-lg mb-8 max-w-lg mx-auto">
                        Join 10,000+ engineers already mastering CS and landing top jobs with Xalora.
                    </p>
                    <div className="flex gap-3 justify-center flex-wrap">
                        <Link
                            to="/signup"
                            className="text-white px-8 py-3.5 rounded-full font-bold text-base transition-all duration-200 shadow-lg shadow-indigo-200 hover:-translate-y-0.5"
                            style={{ background: '#4f46e5' }}
                        >
                            Get Started Free →
                        </Link>
                        <Link
                            to="/problems"
                            className="border-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 px-8 py-3.5 rounded-full font-semibold text-base transition-all duration-200 hover:-translate-y-0.5"
                        >
                            Browse Problems
                        </Link>
                    </div>
                    <p className="text-gray-400 text-sm mt-5">
                        Free forever · No credit card required
                    </p>
                </motion.div>
            </section>
        </Layout>
    );
};

export default Home;
