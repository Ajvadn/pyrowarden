
/**
 * Footer Component
 * 
 * This component displays the website footer with company information,
 * navigation links, newsletter subscription, and social media links.
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Linkedin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import emailjs from 'emailjs-com';

/**
 * Footer Component
 * 
 * Features:
 * - Company information and logo
 * - Navigation links
 * - Newsletter subscription
 * - Social media links
 * - Copyright information
 */
const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Handle newsletter subscription
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // EmailJS configuration
      const EMAILJS_SERVICE_ID = "service_i3h66xg";
      const EMAILJS_TEMPLATE_ID = "template_fgq53nh";
      const EMAILJS_PUBLIC_KEY = "wQmcZvoOqTAhGnRZ3";
      
      const templateParams = {
        from_name: "Website Subscriber",
        from_email: email,
        message: `New subscription request from the website footer.`,
        to_name: 'PyroWarden Team',
        reply_to: email
      };
      
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );
      
      toast({
        title: "Success!",
        description: "Thank you for subscribing to our newsletter.",
        variant: "default"
      });
      
      setEmail('');
    } catch (error) {
      console.error("Error sending subscription:", error);
      
      toast({
        title: "Error",
        description: "There was a problem subscribing. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer id="contact" className="bg-black text-white pt-12 sm:pt-16 pb-6 sm:pb-8 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 pb-8 sm:pb-10 border-b border-gray-700">
          
          {/* Company Information */}
          <div className="sm:col-span-2">
            <div className="mb-4 sm:mb-6">
              <span className="text-2xl sm:text-3xl font-bold text-white">Pyrowarden</span>
            </div>
            <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">
              PyroWarden Technologies provides professional-grade cybersecurity tools and equipment for ethical hackers, penetration testers, and security researchers worldwide.
            </p>
            <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">
              Malappuram<br />
              Kerala, India
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.linkedin.com/company/pyrowarden-technologies/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
              >
                <Linkedin size={16} className="sm:w-5 sm:h-5" />
              </a>
            </div>
          </div>
          
          {/* Company Links */}
          <div>
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-white">Company</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/internships" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                  Internships
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Services Links */}
          <div>
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-white">Services</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a href="#projects" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                  Security Tools
                </a>
              </li>
              <li>
                <a href="#projects" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                  Training Programs
                </a>
              </li>
              <li>
                <a href="#projects" className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base">
                  Consulting
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Newsletter Subscription */}
        <div className="pt-6 sm:pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
            <div>
              <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-white">Stay Updated</h3>
              <p className="text-gray-300 text-sm sm:text-base mb-4">
                Subscribe to our newsletter for the latest updates on cybersecurity tools and training programs.
              </p>
            </div>
            
            <div>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 sm:py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-gray-400 text-sm sm:text-base"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 sm:py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? "Subscribing..." : (
                    <>
                      Subscribe
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
        
        {/* Copyright and Legal Links */}
        <div className="pt-6 sm:pt-8 border-t border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2024 PyroWarden Technologies. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors text-sm">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
