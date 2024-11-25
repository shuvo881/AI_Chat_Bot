// src/components/layout/Header.jsx
import React from 'react';
import { MessageCircle, Github } from 'lucide-react';
import Button from '../common/Button';
import ThemeToggle from './ThemeToggle';

const Header = ({ className = '' }) => {
  return (
    <header className={`
      bg-white dark:bg-gray-900 border-b dark:border-gray-700
      ${className}
    `}>
      <div className="h-16 px-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-6 h-6 text-blue-500" />
            <span className="text-lg font-semibold">ChatBot UI</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:flex"
            onClick={() => window.open('https://github.com', '_blank')}
          >
            <Github className="w-4 h-4 mr-2" />
            Star on GitHub
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;