/**
 * Main Application Component
 * 
 * This is the root component that sets up routing for the Pyrowarden website.
 * It includes all the main pages and handles navigation between them.
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Import main pages
import Index from '@/pages/Index';
import About from '@/pages/About';
import Careers from '@/pages/Careers';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TechDetails from '@/pages/TechDetails';
import DevelopmentProcess from '@/pages/DevelopmentProcess';
import Internships from '@/pages/Internships';
import NotFound from '@/pages/NotFound';

// Import project pages
import WorkwearProject from '@/pages/WorkwearProject';
import HockeyProject from '@/pages/HockeyProject';
import SportRetailProject from '@/pages/SportRetailProject';
import FireCatProject from '@/pages/FireCatProject';

// Import global styles
import './App.css';

/**
 * Error Boundary Component
 */
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('React Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-4">
              {this.state.error?.message || 'An error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * App Component
 * 
 * Sets up the main routing structure for the website.
 * All routes are defined here and point to their respective page components.
 */
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Main Pages */}
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/tech-details" element={<TechDetails />} />
              <Route path="/development-process" element={<DevelopmentProcess />} />
              <Route path="/internships" element={<Internships />} />
              
              {/* Project Pages */}
              <Route path="/projects/workwear" element={<WorkwearProject />} />
              <Route path="/projects/hockey" element={<HockeyProject />} />
              <Route path="/projects/sport-retail" element={<SportRetailProject />} />
              <Route path="/projects/firecat" element={<FireCatProject />} />
              
              {/* 404 Page - Must be last */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </HelmetProvider>
    </ErrorBoundary>
  );
};

export default App;
