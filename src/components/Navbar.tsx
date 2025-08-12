import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShoppingCart, Heart, User, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const { totalItems } = useCart();
  const { wishlistItems } = useWishlist();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

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
          
          <div className="hidden lg:flex items-center space-x-6">
            <Link to="/" className={cn("transition-colors", isScrolled ? "text-gray-700 hover:text-gray-900" : "text-gray-100 hover:text-white")}>Home</Link>
            <Link to="/products" className={cn("transition-colors", isScrolled ? "text-gray-700 hover:text-gray-900" : "text-gray-100 hover:text-white")}>Products</Link>
            <Link to="/about" className={cn("transition-colors", isScrolled ? "text-gray-700 hover:text-gray-900" : "text-gray-100 hover:text-white")}>About</Link>
            <Link to="/careers" className={cn("transition-colors", isScrolled ? "text-gray-700 hover:text-gray-900" : "text-gray-100 hover:text-white")}>Careers</Link>
            
            <div className="flex items-center space-x-2">
              {user ? (
                <>
                  <Link to="/cart" className="relative p-2">
                    <ShoppingCart className={cn("h-5 w-5", isScrolled ? "text-gray-700" : "text-white")} />
                    {totalItems > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                        {totalItems}
                      </Badge>
                    )}
                  </Link>
                  <Link to="/wishlist" className="relative p-2">
                    <Heart className={cn("h-5 w-5", isScrolled ? "text-gray-700" : "text-white")} />
                    {wishlistItems.length > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                        {wishlistItems.length}
                      </Badge>
                    )}
                  </Link>
                  <Link to="/dashboard" className="p-2">
                    <User className={cn("h-5 w-5", isScrolled ? "text-gray-700" : "text-white")} />
                  </Link>
                  <button onClick={signOut} className="p-2" title="Logout">
                    <LogOut className={cn("h-5 w-5", isScrolled ? "text-gray-700" : "text-white")} />
                  </button>
                </>
              ) : (
                <Link to="/auth" className={cn("px-4 py-2 rounded-md transition-colors", isScrolled ? "bg-gray-200 text-gray-700 hover:bg-gray-300" : "bg-gray-700 text-white hover:bg-gray-600")}>
                  Sign In
                </Link>
              )}
            </div>
          </div>
          
          <div className="lg:hidden">
            <button onClick={toggleMenu} className={cn("p-2 rounded-md", isScrolled ? "text-gray-700" : "text-white")}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <div className={cn("lg:hidden transition-all duration-300 overflow-hidden w-full", isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0")}>
        <div className={cn("px-4 pt-2 pb-4 space-y-2 shadow-lg", isScrolled ? "bg-white" : "bg-black/90")}>
          <Link to="/" className={cn("block px-4 py-3 rounded-lg transition-colors", isScrolled ? "text-gray-700 hover:bg-gray-50" : "text-gray-200 hover:bg-gray-900")} onClick={handleNavigation}>Home</Link>
          <Link to="/products" className={cn("block px-4 py-3 rounded-lg transition-colors", isScrolled ? "text-gray-700 hover:bg-gray-50" : "text-gray-200 hover:bg-gray-900")} onClick={handleNavigation}>Products</Link>
          <Link to="/about" className={cn("block px-4 py-3 rounded-lg transition-colors", isScrolled ? "text-gray-700 hover:bg-gray-50" : "text-gray-200 hover:bg-gray-900")} onClick={handleNavigation}>About</Link>
          <Link to="/careers" className={cn("block px-4 py-3 rounded-lg transition-colors", isScrolled ? "text-gray-700 hover:bg-gray-50" : "text-gray-200 hover:bg-gray-900")} onClick={handleNavigation}>Careers</Link>
          {user ? (
            <>
              <Link to="/dashboard" className={cn("block px-4 py-3 rounded-lg transition-colors", isScrolled ? "text-gray-700 hover:bg-gray-50" : "text-gray-200 hover:bg-gray-900")} onClick={handleNavigation}>Dashboard</Link>
              <Link to="/cart" className={cn("block px-4 py-3 rounded-lg transition-colors", isScrolled ? "text-gray-700 hover:bg-gray-50" : "text-gray-200 hover:bg-gray-900")} onClick={handleNavigation}>Cart ({totalItems})</Link>
              <Link to="/wishlist" className={cn("block px-4 py-3 rounded-lg transition-colors", isScrolled ? "text-gray-700 hover:bg-gray-50" : "text-gray-200 hover:bg-gray-900")} onClick={handleNavigation}>Wishlist ({wishlistItems.length})</Link>
              <button onClick={() => { signOut(); handleNavigation(); }} className={cn("block w-full text-left px-4 py-3 rounded-lg transition-colors", isScrolled ? "text-gray-700 hover:bg-gray-50" : "text-gray-200 hover:bg-gray-900")}>Logout</button>
            </>
          ) : (
            <Link to="/auth" className={cn("block px-4 py-3 rounded-lg transition-colors", isScrolled ? "text-gray-700 hover:bg-gray-50" : "text-gray-200 hover:bg-gray-900")} onClick={handleNavigation}>Sign In</Link>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;