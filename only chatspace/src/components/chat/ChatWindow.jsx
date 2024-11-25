// src/components/chat/ChatWindow.jsx
import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { AlertCircle, MessageSquare, ArrowRight } from 'lucide-react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { TypingIndicator } from '../common/Loader';
import useMessages from '../../hooks/useMessages';
import { useChat } from '../../context/ChatContext';

const EmptyState = ({ onStartChat }) => (
  <div className="flex flex-col items-center justify-center h-full text-center p-8">
    <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-4 mb-4">
      <MessageSquare className="w-8 h-8 text-blue-500" />
    </div>
    <h3 className="text-lg font-semibold mb-2">Start a New Chat</h3>
    <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
      Begin your conversation by sending a message. Our AI assistant is ready to help you.
    </p>
    <button
      onClick={onStartChat}
      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
    >
      Start chatting <ArrowRight className="w-4 h-4" />
    </button>
  </div>
);

const LoadingState = () => (
  <div className="flex items-center justify-center h-full">
    <TypingIndicator />
  </div>
);

const NoSelectionState = () => (
  <div className="flex flex-col items-center justify-center h-full text-center p-8">
    <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-4 mb-4">
      <MessageSquare className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="text-lg font-semibold mb-2 text-gray-600 dark:text-gray-300">
      Select a Conversation
    </h3>
    <p className="text-gray-500 dark:text-gray-400 max-w-md">
      Choose a conversation from the sidebar or start a new one.
    </p>
  </div>
);

const ChatWindow = ({ topic, className = '' }) => {
  console.log('Selected Topic:', topic); // Debug log

  const {
    messages = [],
    isLoading,
    sendMessage,
    refreshMessages
  } = useMessages(topic?.id);

  const { error, isTyping } = useChat();
  const inputRef = useRef(null);
  
  // Effect to handle topic changes
  useEffect(() => {
    console.log('Topic changed, messages:', messages);
    if (topic?.id) {
      refreshMessages();
    }
  }, [topic?.id, refreshMessages]);

  const handleStartChat = () => {
    inputRef.current?.focus();
  };

  // Check if topic is properly selected
  const isChatReady = Boolean(topic?.id);

  // Format date for the header
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return dateString;
    }
  };

  // If no topic is selected
  if (!topic) {
    return (
      <div className={`
        flex flex-col h-full w-full
        rounded-lg border dark:border-gray-700 
        bg-white dark:bg-gray-900
        shadow-lg
        ${className}
      `}>
        <NoSelectionState />
      </div>
    );
  }

  return (
    <div className={`
      flex flex-col h-full w-full
      rounded-lg border dark:border-gray-700 
      bg-white dark:bg-gray-900
      shadow-lg
      ${className}
    `}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold truncate">{topic.topic}</h2>
          {messages.length > 0 && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {messages.length} messages
            </span>
          )}
        </div>
        {topic.create_at && (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Created {formatDate(topic.create_at)}
          </span>
        )}
      </div>

      {/* Message Area */}
      <div className="flex-1 overflow-hidden relative">
        {isLoading ? (
          <LoadingState />
        ) : messages.length === 0 ? (
          <EmptyState onStartChat={handleStartChat} />
        ) : (
          <MessageList 
            messages={messages}
            isLoading={isLoading || isTyping}
            key={topic.id} // Ensure MessageList resets when topic changes
          />
        )}
      </div>

      {/* Bottom Section */}
      <div className="border-t dark:border-gray-700">
        {/* Error Message */}
        {error && (
          <div className="px-6 py-3 bg-red-50 dark:bg-red-900/20 border-t dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">{error}</span>
              </div>
              <button
                onClick={refreshMessages}
                className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
          <ChatInput 
            ref={inputRef}
            onSend={sendMessage} 
            disabled={isLoading || !isChatReady}
            placeholder="Type your message..."
            className={messages.length === 0 ? 'animate-pulse-subtle' : ''}
          />
        </div>
      </div>
    </div>
  );
};

ChatWindow.propTypes = {
  topic: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    topic: PropTypes.string,
    create_at: PropTypes.string,
    create_by: PropTypes.number
  }),
  className: PropTypes.string,
};

export default ChatWindow;