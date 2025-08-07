/**
 * Navigation Bar Component
 * 
 * This component provides the main navigation for the website.
 * It includes responsive design for mobile, tablet, and desktop.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  NavigationMenu, 
  NavigationMenuContent, 
  NavigationMenuItem, 
  NavigationMenuLink, 
  NavigationMenuList, 
  navigationMenuTriggerStyle 
} from '@/components/ui/navigation-menu';

/**
 * Navbar Component
 * 
 * Features:
 * - Responsive design (mobile, tablet, desktop)
 * - Scroll-based background color change
 * - Mobile hamburger menu
 * - Smooth animations
 */
const Navbar: React.FC = () => {
  // State for scroll detection and mobile menu
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Handle scroll events to change navbar background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Scroll to contact section and close mobile menu
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  // Close mobile menu when navigating
  const handleNavigation = () => {
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <motion.nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full",
        isScrolled ? "bg-white shadow-lg" : "bg-black/90"
      )}
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className={cn(
                "logo-text text-xl sm:text-2xl",
                isScrolled ? "text-black" : "text-white"
              )}>
                PYROWARDEN
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <NavigationMenu className={cn(isScrolled ? "" : "text-white")}>
              <NavigationMenuList className="space-x-2">
                <NavigationMenuItem>
                  <Link to="/">
                    <NavigationMenuLink className={cn(
                      navigationMenuTriggerStyle(),
                      "text-sm sm:text-base",
                      isScrolled ? "text-gray-700 hover:text-gray-900" : "text-gray-100 hover:text-white bg-transparent hover:bg-gray-800"
                    )}>
                      Home
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link to="/about">
                    <NavigationMenuLink className={cn(
                      navigationMenuTriggerStyle(),
                      "text-sm sm:text-base",
                      isScrolled ? "text-gray-700 hover:text-gray-900" : "text-gray-100 hover:text-white bg-transparent hover:bg-gray-800"
                    )}>
                      About Us
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link to="/internships">
                    <NavigationMenuLink className={cn(
                      navigationMenuTriggerStyle(),
                      "text-sm sm:text-base",
                      isScrolled ? "text-gray-700 hover:text-gray-900" : "text-gray-100 hover:text-white bg-transparent hover:bg-gray-800"
                    )}>
                      Internships
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link to="/careers">
                    <NavigationMenuLink className={cn(
                      navigationMenuTriggerStyle(),
                      "text-sm sm:text-base",
                      isScrolled ? "text-gray-700 hover:text-gray-900" : "text-gray-100 hover:text-white bg-transparent hover:bg-gray-800"
                    )}>
                      Careers
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <button 
                    onClick={scrollToContact}
                    className={cn(
                      "px-4 py-2 rounded-md transition-colors text-sm sm:text-base",
                      isScrolled ? "bg-gray-200 text-gray-700 hover:bg-gray-300" : "bg-gray-700 text-white hover:bg-gray-600"
                    )}
                  >
                    Contact Us
                  </button>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          
          {/* Tablet Navigation */}
          <div className="hidden md:block lg:hidden">
            <NavigationMenu className={cn(isScrolled ? "" : "text-white")}>
              <NavigationMenuList className="space-x-1">
                <NavigationMenuItem>
                  <Link to="/">
                    <NavigationMenuLink className={cn(
                      navigationMenuTriggerStyle(),
                      "text-sm",
                      isScrolled ? "text-gray-700 hover:text-gray-900" : "text-gray-100 hover:text-white bg-transparent hover:bg-gray-800"
                    )}>
                      Home
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link to="/about">
                    <NavigationMenuLink className={cn(
                      navigationMenuTriggerStyle(),
                      "text-sm",
                      isScrolled ? "text-gray-700 hover:text-gray-900" : "text-gray-100 hover:text-white bg-transparent hover:bg-gray-800"
                    )}>
                      About
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link to="/internships">
                    <NavigationMenuLink className={cn(
                      navigationMenuTriggerStyle(),
                      "text-sm",
                      isScrolled ? "text-gray-700 hover:text-gray-900" : "text-gray-100 hover:text-white bg-transparent hover:bg-gray-800"
                    )}>
                      Internships
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <button 
                    onClick={scrollToContact}
                    className={cn(
                      "px-3 py-2 rounded-md transition-colors text-sm",
                      isScrolled ? "bg-gray-200 text-gray-700 hover:bg-gray-300" : "bg-gray-700 text-white hover:bg-gray-600"
                    )}
                  >
                    Contact
                  </button>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu} 
              className={cn(
                "p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2",
                isScrolled ? "text-gray-700 focus:ring-gray-500" : "text-white focus:ring-white"
              )}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={cn(
        "md:hidden transition-all duration-300 overflow-hidden w-full",
        isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className={cn(
          "px-4 pt-2 pb-4 space-y-2 shadow-lg",
          isScrolled ? "bg-white" : "bg-black/90"
        )}>
          <Link 
            to="/" 
            className={cn(
              "block px-4 py-3 rounded-lg text-base font-medium transition-colors",
              isScrolled ? "text-gray-700 hover:bg-gray-50" : "text-gray-200 hover:bg-gray-900"
            )}
            onClick={handleNavigation}
          >
            Home
          </Link>
          
          <Link 
            to="/about" 
            className={cn(
              "block px-4 py-3 rounded-lg text-base font-medium transition-colors",
              isScrolled ? "text-gray-700 hover:bg-gray-50" : "text-gray-200 hover:bg-gray-900"
            )}
            onClick={handleNavigation}
          >
            About Us
          </Link>
          
          <Link 
            to="/internships" 
            className={cn(
              "block px-4 py-3 rounded-lg text-base font-medium transition-colors",
              isScrolled ? "text-gray-700 hover:bg-gray-50" : "text-gray-200 hover:bg-gray-900"
            )}
            onClick={handleNavigation}
          >
            Internships
          </Link>
          
          <Link 
            to="/careers" 
            className={cn(
              "block px-4 py-3 rounded-lg text-base font-medium transition-colors",
              isScrolled ? "text-gray-700 hover:bg-gray-50" : "text-gray-200 hover:bg-gray-900"
            )}
            onClick={handleNavigation}
          >
            Careers
          </Link>
          
          <button 
            onClick={scrollToContact}
            className={cn(
              "block w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-colors",
              isScrolled ? "text-gray-700 bg-gray-200 hover:bg-gray-300" : "text-white bg-gray-700 hover:bg-gray-600"
            )}
          >
            Contact Us
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
