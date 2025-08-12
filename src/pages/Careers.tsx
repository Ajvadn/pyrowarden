// Import the main page layout component that provides consistent navigation and footer
import PageLayout from '@/components/PageLayout';
// Import icons from lucide-react library for UI elements
import { ArrowLeft, Mail, Linkedin, Phone } from 'lucide-react';
// Import Link component for client-side navigation without page refresh
import { Link } from 'react-router-dom';
// Import motion component from framer-motion for smooth animations
import { motion } from "framer-motion";
// Import useEffect hook for handling side effects like scrolling to top
import { useEffect } from 'react';

// Define the main Careers component as a functional React component
const Careers = () => {
  // useEffect hook runs after component mounts to scroll to top of page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Return JSX that defines the component's UI structure
  return (
    // Main container with full screen height and white background
    <div className="min-h-screen bg-white">
      {/* PageLayout wrapper provides consistent navigation, footer, but hides contact section */}
      <PageLayout showContact={false}>
        {/* Main section with responsive padding for different screen sizes */}
        <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          {/* Container for centering content with max width */}
          <div className="container mx-auto">
            {/* Inner container with maximum width of 6xl for better readability */}
            <div className="max-w-6xl mx-auto">
              {/* Back to home navigation link with arrow icon */}
              <Link to="/" className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-6 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
              
              {/* Animated main heading using framer-motion */}
              <motion.h1 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5 }} 
                className="text-4xl font-bold mb-6"
              >
                Join Our Team
              </motion.h1>
              
              {/* Content wrapper with prose styling for better typography */}
              <div className="prose prose-lg max-w-none">
                {/* First animated paragraph with fade-in effect */}
                <motion.p 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  transition={{ duration: 0.5, delay: 0.2 }} 
                  className="text-xl text-gray-600 mb-4"
                >
                  We're looking for passionate innovators to help us revolutionize the smart textile industry.
                </motion.p>
                
                {/* Second animated paragraph with delayed fade-in */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-xl text-gray-600 mb-12"
                >
                  We welcome both full-time professionals and interns who are eager to contribute to groundbreaking technology.
                </motion.p>
                
                {/* Main content section with slide-up animation */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.6 }}
                  className="mb-16"
                >
                  {/* Section heading for benefits */}
                  <h2 className="text-3xl font-bold mb-6">Why Join Pyrowarden?</h2>
                  {/* Grid layout for benefit cards - 1 column on mobile, 3 on desktop */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Array of benefit objects mapped to UI cards */}
                    {[
                      {
                        title: "Innovation",
                        description: "Work on cutting-edge technology that's changing multiple industries."
                      },
                      {
                        title: "Impact",
                        description: "Create solutions that enhance safety, performance, and quality of life."
                      },
                      {
                        title: "Growth",
                        description: "Develop your skills in a rapidly expanding field with diverse challenges."
                      }
                    ].map((benefit, i) => (
                      // Individual benefit card with styling and full height
                      <div key={i} className="bg-gray-50 p-6 rounded-lg border border-gray-100 h-full">
                        {/* Benefit title */}
                        <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                        {/* Benefit description */}
                        <p className="text-gray-600">{benefit.description}</p>
                      </div>
                    ))}
                  </div>
                  
                  {/* Contact section container with card styling */}
                  <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm mt-12">
                    {/* Contact section heading */}
                    <h3 className="font-bold text-xl mb-6">Contact Our COO</h3>
                    {/* Inner contact card */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      {/* Flexbox container for centering COO information */}
                      <div className="flex flex-col items-center text-center">
                        {/* COO profile image with circular crop and grayscale filter */}
                        <img 
                          src="/team-images/jithin-pr.jpeg"
                          alt="Jithin PR"
                          className="w-32 h-32 rounded-full mb-4 object-cover filter grayscale"
                        />
                        {/* COO name */}
                        <h3 className="text-xl font-bold text-gray-900">Jithin PR</h3>
                        {/* COO title */}
                        <p className="text-gray-600 mb-4">COO</p>
                        {/* Contact methods container with vertical spacing */}
                        <div className="flex flex-col space-y-3">
                          {/* Email contact link with mail icon */}
                          <a href="mailto:jithu4953@gmail.com" className="flex items-center text-gray-700 hover:text-blue-600">
                            <Mail className="w-5 h-5 mr-2" />
                            jithu4953@gmail.com
                          </a>
                          {/* Phone contact link with phone icon */}
                          <a href="tel:+919895622479" className="flex items-center text-gray-700 hover:text-blue-600">
                            <Phone className="w-5 h-5 mr-2" />
                            +91 9895622479
                          </a>
                          {/* LinkedIn profile link with LinkedIn icon and external link attributes */}
                          <a 
                            href="https://linkedin.com/in/jithin-p-r" 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-gray-700 hover:text-blue-600"
                          >
                            <Linkedin className="w-5 h-5 mr-2" />
                            LinkedIn Profile
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </PageLayout>
    </div>
  );
};

// Export the component as default for use in other files
export default Careers;