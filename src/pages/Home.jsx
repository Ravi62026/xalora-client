import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components";
import { Button } from "../components/ui/Button";

const Home = () => {
  const navigate = useNavigate();

  // Floating animation controls
  const floatingControls = useAnimation();

  useEffect(() => {
    floatingControls.start({
      y: [0, -20, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    });
  }, [floatingControls]);

  // Rotating cube animation
  const cubeControls = useAnimation();

  useEffect(() => {
    cubeControls.start({
      rotateY: 360,
      transition: {
        duration: 20,
        repeat: Infinity,
        ease: "linear"
      }
    });
  }, [cubeControls]);

  // Wave animation controls
  const waveControls = useAnimation();

  useEffect(() => {
    waveControls.start({
      y: [0, -10, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    });
  }, [waveControls]);

  return (
    <Layout>

      {/* Hero Section with Enhanced 3D Animated Background */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden bg-gradient-to-br from-gray-900 via-slate-900 to-black">
        {/* Enhanced 3D Animated Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating geometric shapes with enhanced animations */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-16 h-16 border-2 border-blue-500/30 rotate-45"
            animate={floatingControls}
          />
          <motion.div
            className="absolute top-1/3 right-1/3 w-12 h-12 bg-purple-500/20 rounded-full"
            animate={{
              y: [0, -30, 0],
              scale: [1, 1.2, 1],
              transition: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          />
          <motion.div
            className="absolute bottom-1/4 left-1/3 w-20 h-20 border-2 border-cyan-500/30"
            animate={{
              rotate: [0, 90, 180, 270, 360],
              transition: {
                duration: 15,
                repeat: Infinity,
                ease: "linear"
              }
            }}
          />
          <motion.div
            className="absolute bottom-1/3 right-1/4 w-14 h-14 bg-emerald-500/20 rounded-lg"
            animate={{
              x: [0, 20, 0],
              y: [0, -20, 0],
              transition: {
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          />

          {/* Enhanced 3D Rotating Cube with glow effect */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32"
            animate={cubeControls}
            style={{ perspective: '1000px' }}
          >
            <div className="relative w-full h-full transform-style-3d">
              <div className="absolute w-full h-full bg-blue-500/10 border border-blue-500/30 transform rotate-y-0 translate-z-16 shadow-[0_0_20px_rgba(59,130,246,0.3)]"></div>
              <div className="absolute w-full h-full bg-purple-500/10 border border-purple-500/30 transform rotate-y-90 translate-z-16 shadow-[0_0_20px_rgba(147,51,234,0.3)]"></div>
              <div className="absolute w-full h-full bg-cyan-500/10 border border-cyan-500/30 transform rotate-y-180 translate-z-16 shadow-[0_0_20px_rgba(6,182,212,0.3)]"></div>
              <div className="absolute w-full h-full bg-emerald-500/10 border border-emerald-500/30 transform rotate-y-270 translate-z-16 shadow-[0_0_20px_rgba(16,185,129,0.3)]"></div>
              <div className="absolute w-full h-full bg-pink-500/10 border border-pink-500/30 transform rotate-x-90 translate-z-16 shadow-[0_0_20px_rgba(236,72,153,0.3)]"></div>
              <div className="absolute w-full h-full bg-yellow-500/10 border border-yellow-500/30 transform rotate-x-270 translate-z-16 shadow-[0_0_20px_rgba(234,179,8,0.3)]"></div>
            </div>
          </motion.div>

          {/* Floating orbs with pulsing effect */}
          <motion.div
            className="absolute top-1/5 right-1/5 w-8 h-8 bg-blue-500/30 rounded-full blur-sm"
            animate={{
              y: [0, -40, 0],
              scale: [1, 1.5, 1],
              opacity: [0.5, 0.8, 0.5],
              transition: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          />
          <motion.div
            className="absolute bottom-1/5 left-1/5 w-10 h-10 bg-purple-500/30 rounded-full blur-sm"
            animate={{
              y: [0, 40, 0],
              scale: [1, 1.3, 1],
              opacity: [0.5, 0.9, 0.5],
              transition: {
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          />

          {/* Wave-like background elements */}
          <motion.div
            className="absolute top-0 left-0 w-full h-full"
            animate={waveControls}
          >
            <div className="absolute top-1/6 left-1/6 w-64 h-64 border border-blue-500/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-1/6 right-1/6 w-96 h-96 border border-purple-500/10 rounded-full blur-xl"></div>
          </motion.div>

          {/* Particle effects with varied animations */}
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -Math.random() * 100 - 50],
                x: [0, (Math.random() - 0.5) * 50],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}

          {/* Pulsing gradient circles */}
          <motion.div
            className="absolute top-1/3 left-1/5 w-32 h-32 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-2xl"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.6, 0.3],
              transition: {
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-full blur-2xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.7, 0.3],
              transition: {
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          />
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 mb-6">
              Xalora
            </h1>

            <motion.p
              className="text-2xl md:text-4xl font-bold text-white mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              Transform Your <span className="text-blue-400">Coding Journey</span>
            </motion.p>

            <motion.p
              className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
            >
              From <span className="text-purple-400">Hello World</span> to your{" "}
              <span className="text-cyan-400">Dream Job</span> - All in One Platform
            </motion.p>

            <motion.p
              className="text-lg text-gray-400 max-w-2xl mx-auto mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
            >
              Master Data Structures & Algorithms, Build Your Resume with AI,
              Practice Coding Interviews, and Access 50+ LLMs - Everything a CS Engineer Needs
            </motion.p>
          </motion.div>


          {/* Feature Highlights */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5, duration: 1 }}
          >
            {[
              { number: "50+", label: "Topics" },
              { number: "500+", label: "DSA Problems" },
              { number: "50+", label: "LLMs" },
              { number: "10K+", label: "Engineers" }
            ].map((item, index) => (
              <div
                key={index}
                className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 transition-all duration-300 hover:border-cyan-500 hover:shadow-xl hover:shadow-cyan-500/20"
              >
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
                  {item.number}
                </div>
                <div className="text-gray-300 font-medium">
                  {item.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Enhanced Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.5, duration: 1 }}
        >
          <div className="flex flex-col items-center">
            <span className="mb-2">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Powerful Features
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Everything you need to master computer science and land your dream job
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                title: "AI-Powered Learning",
                description: "Personalized learning paths with 50+ LLMs to guide your journey",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                )
              },
              {
                title: "DSA Mastery",
                description: "500+ handpicked problems with detailed solutions and explanations",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                )
              },
              {
                title: "Resume AI Builder",
                description: "ATS-optimized resumes with AI-powered suggestions and improvements",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )
              },
              {
                title: "Interview Simulator",
                description: "Realistic mock interviews with AI feedback and performance analysis",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                )
              },
              {
                title: "Coding Playground",
                description: "Multi-language support with real-time execution and debugging",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                )
              },
              {
                title: "Progress Tracking",
                description: "Detailed analytics and insights to track your learning journey",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                )
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 transition-all duration-300 hover:border-cyan-500 hover:shadow-2xl hover:shadow-cyan-500/20"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                viewport={{ once: true }}
              >
                <div className="mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Success Stories
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Join thousands of engineers who transformed their careers with Xalora
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Ananya Sharma",
                role: "Software Engineer at Google",
                content: "Xalora's AI-powered learning helped me master DSA in just 3 months. The interview simulator was a game-changer for my Google interview prep.",
                avatar: "A"
              },
              {
                name: "Rohan Patel",
                role: "SDE at Amazon",
                content: "The resume builder got me noticed by top recruiters. The 500+ DSA problems with detailed solutions made my preparation thorough and effective.",
                avatar: "R"
              },
              {
                name: "Priya Kumar",
                role: "ML Engineer at Microsoft",
                content: "Access to 50+ LLMs accelerated my learning. The progress tracking feature helped me stay consistent and focused on my goals.",
                avatar: "P"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 transition-all duration-300 hover:border-purple-500 hover:shadow-2xl hover:shadow-purple-500/20"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-300 italic">
                  "{testimonial.content}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-red-900/30 via-purple-900/30 to-blue-900/30 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-red-500/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-blue-500/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-4xl mx-auto text-center px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Join 10,000+ future engineers who are already mastering CS with Xalora
            </p>

            <div className="mt-8 space-y-2">
              <p className="text-gray-400">
                Free forever • No credit card required
              </p>
              
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;