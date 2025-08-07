/**
 * Home Page Component
 * 
 * This is the main landing page of the Pyrowarden website.
 * It displays the hero section, features, projects, and other main content.
 */

import React, { useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import SEO from '@/components/SEO';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Projects from '@/components/Projects';
import WhyWrlds from '@/components/WhyWrlds';

/**
 * Index Component
 * 
 * Renders the home page with all main sections:
 * - Hero section with call-to-action
 * - Features showcasing our services
 * - Projects portfolio
 * - Why choose Pyrowarden section
 * - Contact information
 */
const Index: React.FC = () => {
  useEffect(() => {
    console.log('Index component: Component mounted successfully');
  }, []);

  console.log('Index component: Rendering...');

  return (
    <PageLayout>
      {/* SEO Meta Tags */}
      <SEO 
        title="Pyrowarden - Professional Cybersecurity Tools & Training"
        description="Get hands-on experience through our intensive 1-month tech internships and access professional cybersecurity tools for ethical hackers and security professionals."
        name="Pyrowarden"
        type="website"
        imageUrl="/og-image.png"
      />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Features Section */}
      <Features />
      
      {/* Projects Section */}
      <Projects />
      
      {/* Why Choose Pyrowarden Section */}
      <WhyWrlds />
    </PageLayout>
  );
};

export default Index;
