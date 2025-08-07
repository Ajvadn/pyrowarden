
/**
 * Contact Information Component
 * 
 * This component displays contact information for key team members.
 * It includes email and LinkedIn links for easy communication.
 */

import React from 'react';
import { Mail, Linkedin } from 'lucide-react';

/**
 * ContactInfo Component
 * 
 * Features:
 * - Team member contact cards
 * - Email and LinkedIn links
 * - Responsive design
 * - Professional styling
 */
const ContactInfo: React.FC = () => {
  return (
    <section id="contact-info" className="scroll-mt-24 bg-gradient-to-b from-white to-black text-white relative py-8 md:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <div className="inline-block mb-2 px-2 py-1 bg-white text-black rounded-full text-xs font-medium">
            Get In Touch
          </div>
          <h2 className="section-title text-xl sm:text-2xl md:text-3xl mb-3 text-black">
            Contact Us Today
          </h2>
          <p className="hero-subtitle text-gray-700 text-sm sm:text-base max-w-2xl mx-auto">
            Have questions about our professional security tools? Reach out to our team and let's discuss how we can help enhance your cybersecurity capabilities.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          
          {/* Ajvad N Contact Card */}
          <div className="bg-white rounded-lg shadow-lg p-3 sm:p-4 border border-gray-200">
            <div className="flex flex-col items-center text-center">
              <img 
                src="/team-images/ajvad-n.jpeg"
                alt="Ajvad N"
                className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full mb-2 object-cover filter grayscale"
              />
              <h3 className="team-name text-sm sm:text-base text-gray-900">Ajvad N</h3>
              <p className="team-role text-gray-600 mb-2 text-xs">CEO and Founder</p>
              <div className="flex flex-col space-y-1 w-full">
                <a 
                  href="mailto:ajvadaju2003@gmail.com" 
                  className="flex items-center justify-center text-gray-700 hover:text-blue-600 text-xs"
                >
                  <Mail className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="truncate">ajvadaju2003@gmail.com</span>
                </a>
                <a 
                  href="https://www.linkedin.com/in/ajvad-n?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3Br4cfzbGkQN%2Bs%2BkYK52XkvA%3D%3D" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center text-gray-700 hover:text-blue-600 text-xs"
                >
                  <Linkedin className="w-3 h-3 mr-1 flex-shrink-0" />
                  LinkedIn Profile
                </a>
              </div>
            </div>
          </div>

          {/* Jithin PR Contact Card */}
          <div className="bg-white rounded-lg shadow-lg p-3 sm:p-4 border border-gray-200">
            <div className="flex flex-col items-center text-center">
              <img 
                src="/team-images/jithin-pr.jpeg"
                alt="Jithin PR"
                className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full mb-2 object-cover filter grayscale"
              />
              <h3 className="team-name text-sm sm:text-base text-gray-900">Jithin PR</h3>
              <p className="team-role text-gray-600 mb-2 text-xs">COO</p>
              <div className="flex flex-col space-y-1 w-full">
                <a 
                  href="mailto:jithu4953@gmail.com" 
                  className="flex items-center justify-center text-gray-700 hover:text-blue-600 text-xs"
                >
                  <Mail className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="truncate">jithu4953@gmail.com</span>
                </a>
                <a 
                  href="https://linkedin.com/in/jithin-p-r" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center text-gray-700 hover:text-blue-600 text-xs"
                >
                  <Linkedin className="w-3 h-3 mr-1 flex-shrink-0" />
                  LinkedIn Profile
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactInfo;
