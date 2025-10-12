import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import AnimatedTitle from './AnimatedTitle';
import FloatingElements from './FloatingElements';
import CTAButtons from './CTAButtons';
import { fadeInUp, staggerContainer } from '../utils/animations';

/**
 * HeroSection Component
 * Full-screen hero section with animated title, tagline, floating elements,
 * and scroll-triggered parallax animations
 */
const HeroSection = ({ onGetStarted, onExplorePlatform }) => {
  const sectionRef = useRef(null);
  
  // Track scroll progress for parallax effects
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start']
  });

  // Transform scroll progress into parallax values
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900"
    >
      {/* Floating decorative elements */}
      <FloatingElements />

      {/* Hero content with parallax */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {/* Animated Title with parallax */}
          <motion.div style={{ y: titleY, opacity: titleOpacity }}>
            <AnimatedTitle text="Xalora" className="mb-6" />
          </motion.div>

          {/* Tagline */}
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-6"
            style={{ fontFamily: 'Poppins, sans-serif' }}
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            From Hello World to Your Dream Job
          </motion.h2>

          {/* Subtext */}
          <motion.p
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto"
            style={{ fontFamily: 'Inter, sans-serif' }}
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            Quizzes, DSA, Resume AI, and 50+ LLMs — everything for a CS engineer
          </motion.p>

          {/* CTA Buttons with glowing effects */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 1.5, duration: 0.7 }}
          >
            <CTAButtons 
              onGetStarted={onGetStarted}
              onExplorePlatform={onExplorePlatform}
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-
