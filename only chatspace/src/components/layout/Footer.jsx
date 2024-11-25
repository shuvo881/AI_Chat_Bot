// src/components/common/Footer.jsx
import React from 'react';

const Footer = ({ className = '' }) => {
  const year = new Date().getFullYear();

  return (
    <footer className={`
      bg-white dark:bg-gray-900 border-t dark:border-gray-700
      ${className}
    `}>
      <div className="h-16 px-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            © {year} ChatBot UI. All rights reserved.
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <a 
            href="#" 
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            Privacy Policy
          </a>
          <a 
            href="#" 
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;