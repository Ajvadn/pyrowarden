/**
 * Application Entry Point
 * 
 * This file is the main entry point for the React application.
 * It renders the root App component into the DOM.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// Import global styles
import './index.css';

// Debug logging
console.log('main.tsx: Starting application...');

// Get the root element from the DOM
const rootElement = document.getElementById('root');

// Ensure the root element exists
if (!rootElement) {
  console.error('main.tsx: Root element not found!');
  throw new Error('Root element not found');
}

console.log('main.tsx: Root element found, creating React root...');

// Create the React root and render the app
const root = ReactDOM.createRoot(rootElement);

console.log('main.tsx: Rendering App component...');

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log('main.tsx: App component rendered successfully');
