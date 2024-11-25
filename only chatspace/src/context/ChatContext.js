// src/context/ChatContext.jsx
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import chatApi from '../services/api';

const ChatContext = createContext(null);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false);
  const retryTimeoutRef = useRef(null);

  const handleError = useCallback((error) => {
    console.error('Chat Error:', error);
    setError(error.message || 'An unexpected error occurred');
    setIsTyping(false);

    setTimeout(() => {
      setError(null);
    }, 5000);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const startTyping = useCallback(() => {
    setIsTyping(true);
  }, []);

  const stopTyping = useCallback(() => {
    setIsTyping(false);
  }, []);

  const startRetry = useCallback(() => {
    setRetrying(true);
    setError(null);
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
    retryTimeoutRef.current = setTimeout(() => {
      setRetrying(false);
      setError('Retry timeout exceeded. Please try again.');
    }, 10000);
  }, []);

  const stopRetry = useCallback(() => {
    setRetrying(false);
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
  }, []);

  const checkApiStatus = useCallback(async () => {
    try {
      await chatApi.getTopics();
      return true;
    } catch (error) {
      console.error('API Status Check Error:', error);
      return false;
    }
  }, []);

  React.useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  const value = {
    isTyping,
    error,
    retrying,
    handleError,
    clearError,
    startTyping,
    stopTyping,
    startRetry,
    stopRetry,
    checkApiStatus,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;