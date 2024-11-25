// src/components/common/Loader.jsx
import React from 'react';

export const ThreeDots = () => {
  return (
    <div className="flex items-center space-x-1 px-2 py-1">
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
    </div>
  );
};

export const Spinner = () => {
  return (
    <div className="flex justify-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  );
};

export const TypingIndicator = () => {
  return (
    <div className="flex items-center space-x-2 text-gray-500 text-sm">
      <div className="flex items-center space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
      </div>
      <span>Assistant is typing</span>
    </div>
  );
};

// Main Loader component that combines different styles
const Loader = ({ type = 'spinner', text, size = 'medium', className = '' }) => {
  const sizes = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  const renderLoader = () => {
    switch (type) {
      case 'dots':
        return <ThreeDots />;
      case 'typing':
        return <TypingIndicator />;
      default:
        return (
          <div className="flex flex-col items-center space-y-2">
            <div className={`animate-spin rounded-full border-b-2 border-blue-500 ${sizes[size]}`}></div>
            {text && <span className="text-sm text-gray-500">{text}</span>}
          </div>
        );
    }
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      {renderLoader()}
    </div>
  );
};

export default Loader;