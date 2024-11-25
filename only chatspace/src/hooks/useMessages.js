// src/hooks/useMessages.js
import { useState, useCallback, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import chatApi from '../services/api';

const useMessages = (topicId) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const {
    startTyping,
    stopTyping,
    handleError,
    clearError,
  } = useChat();

  // Reset messages when topic changes
  useEffect(() => {
    setMessages([]);
  }, [topicId]);

  // Fetch messages
  const fetchMessages = useCallback(async () => {
    if (!topicId) {
      setMessages([]);
      return;
    }

    setIsLoading(true);
    clearError();

    try {
      console.log('Fetching messages for topic:', topicId);
      const data = await chatApi.getMessages(topicId);
      console.log('Fetched messages:', data);
      
      // Sort messages by timestamp
      const sortedMessages = Array.isArray(data) 
        ? data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
        : [];
      
      setMessages(sortedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  }, [topicId, handleError, clearError]);

  // Send message
  const sendMessage = useCallback(async (content) => {
    if (!content.trim() || !topicId) return;

    const tempId = Date.now();
    const tempMessage = {
      id: tempId,
      user_message: content,
      bot_response: '...',
      timestamp: new Date().toISOString(),
      topic: topicId
    };

    // Optimistic update
    setMessages(prev => [...prev, tempMessage]);
    startTyping();
    clearError();

    try {
      const newMessage = await chatApi.sendMessage(topicId, content);
      console.log('New message:', newMessage);

      // Replace temp message with real one
      setMessages(prev => prev.map(msg => 
        msg.id === tempId ? newMessage : msg
      ));
    } catch (error) {
      console.error('Error sending message:', error);
      handleError(error);
      
      // Remove temp message
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
    } finally {
      stopTyping();
    }
  }, [topicId, startTyping, stopTyping, handleError, clearError]);

  // Fetch messages when topic changes
  useEffect(() => {
    if (topicId) {
      fetchMessages();
    }
  }, [topicId, fetchMessages]);

  return {
    messages,
    isLoading,
    sendMessage,
    refreshMessages: fetchMessages
  };
};

export default useMessages;