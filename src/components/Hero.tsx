/**
 * Hero Section Component
 * 
 * This is the main hero section displayed on the home page.
 * It includes a background image, call-to-action buttons, and feature highlights.
 */

import React from 'react';
import { ArrowRight, Code, Cpu, Layers, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import heroTechImage from '@/assets/hero-tech.webp';

/**
 * Hero Component
 * 
 * Features:
 * - Responsive background image
 * - Call-to-action buttons
 * - Feature highlights grid
 * - Smooth animations
 */
const Hero: React.FC = () => {
  const isMobile = useIsMobile();

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
        duration: 0.8
      }
    }
  };

  const itemVariants = {
    hidden: {
      y: 20,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  // Scroll to projects section
  const scrollToProjects = (e: React.MouseEvent) => {
    e.preventDefault();
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Navigate to internships page
  const navigateToInternships = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = '/internships';
  };

  return (
    <motion.div 
      className="relative w-full" 
      initial="hidden" 
      animate="visible" 
      variants={containerVariants}
    >
      {/* Hero Banner Section */}
      <div className="banner-container bg-black relative overflow-hidden h-[50vh] sm:h-[60vh] md:h-[400px] lg:h-[450px] xl:h-[500px] w-full">
        {/* Background Image */}
        <div className="absolute inset-0 bg-black w-full">
          <img 
            src={heroTechImage} 
            alt="PyroWarden cybersecurity tools" 
            className={`w-full h-full object-cover opacity-70 ${isMobile ? 'object-right' : 'object-center'}`} 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-white"></div>
        </div>
        
        {/* Hero Content Overlay */}
        <div className="banner-overlay bg-transparent pt-16 sm:pt-20 md:pt-24 lg:pt-28 w-full">
          <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center h-full">
            <motion.div className="w-full max-w-4xl text-center" variants={itemVariants}>
              
              {/* Main Title */}
              <motion.h1 
                className="hero-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white" 
                variants={itemVariants}
              >
                Professional Tech Training & Gadget Store
              </motion.h1>
              
              {/* Subtitle */}
              <motion.p 
                className="hero-subtitle text-sm sm:text-base md:text-lg text-gray-300 mt-3 sm:mt-4 md:mt-6 max-w-3xl mx-auto" 
                variants={itemVariants}
              >
                Get hands-on experience through our intensive 1-month tech internships and access professional cybersecurity tools for ethical hackers and security professionals.
              </motion.p>
              
              {/* Call-to-Action Buttons */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-6 md:mt-8 justify-center items-center" 
                variants={itemVariants}
              >
                <button 
                  className="w-full sm:w-auto min-h-[40px] sm:min-h-[44px] px-4 sm:px-6 py-2 sm:py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all shadow-lg hover:shadow-xl hover:shadow-gray-300/20 flex items-center justify-center group text-sm font-medium"
                  onClick={scrollToProjects}
                >
                  Shop Products
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button 
                  className="w-full sm:w-auto min-h-[40px] sm:min-h-[44px] px-4 sm:px-6 py-2 sm:py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:shadow-gray-300/20 flex items-center justify-center group text-sm font-medium"
                  onClick={navigateToInternships}
                >
                  Join Internships
                  <MessageSquare className="ml-2 w-4 h-4 group-hover:scale-110 transition-transform" />
                </button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Feature Highlights Grid */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 mx-auto">
        <motion.div 
          className="mt-4 sm:mt-6 md:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4" 
          variants={containerVariants} 
          initial="hidden" 
          animate="visible" 
          transition={{ delay: 0.6 }}
        >
          {/* Tech Internships Card */}
          <motion.div 
            className="bg-white p-3 sm:p-4 md:p-5 rounded-xl shadow-sm border border-gray-100 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-md" 
            variants={itemVariants}
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gray-100 flex items-center justify-center rounded-lg text-gray-500 mb-2 sm:mb-3">
              <Cpu className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </div>
            <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-2 text-gray-800">
              Tech Internships
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm">
              1-month intensive programs in cybersecurity, web development, and emerging technologies.
            </p>
          </motion.div>
          
          {/* RFID & NFC Tools Card */}
          <motion.div 
            className="bg-white p-3 sm:p-4 md:p-5 rounded-xl shadow-sm border border-gray-100 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-md" 
            variants={itemVariants}
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gray-100 flex items-center justify-center rounded-lg text-gray-500 mb-2 sm:mb-3">
              <Code className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </div>
            <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-2 text-gray-800">
              RFID & NFC Tools
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm">
              Advanced radio frequency tools for security research and access control testing.
            </p>
          </motion.div>
          
          {/* Professional Training Card */}
          <motion.div 
            className="bg-white p-3 sm:p-4 md:p-5 rounded-xl shadow-sm border border-gray-100 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:col-span-2 lg:col-span-1" 
            variants={itemVariants}
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gray-100 flex items-center justify-center rounded-lg text-gray-500 mb-2 sm:mb-3">
              <Layers className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </div>
            <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-2 text-gray-800">
              Professional Training
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm">
              Expert mentorship and industry-recognized certificates for career advancement in technology.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Hero;
