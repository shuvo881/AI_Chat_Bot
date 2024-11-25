// src/components/chat/MessageList.jsx
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { User, Bot } from 'lucide-react';

const Message = ({ content, isBot, timestamp }) => {
  const formatTime = (timestamp) => {
    try {
      return new Date(timestamp).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      });
    } catch (error) {
      return '';
    }
  };

  return (
    <div className={`flex gap-3 ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
      {/* Avatar */}
      <div className={`
        h-8 w-8 rounded-full flex items-center justify-center shrink-0
        ${isBot 
          ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' 
          : 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400'
        }
      `}>
        {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
      </div>

      {/* Message Content */}
      <div className={`flex flex-col gap-1 max-w-[80%] ${isBot ? 'items-start' : 'items-end'}`}>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {formatTime(timestamp)}
        </span>
        <div className={`
          rounded-lg px-4 py-2
          ${isBot 
            ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100' 
            : 'bg-blue-500 text-white'
          }
        `}>
          {content}
        </div>
      </div>
    </div>
  );
};

const MessageList = ({ messages = [], isLoading = false }) => {
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!Array.isArray(messages)) {
    console.error('Messages is not an array:', messages);
    return null;
  }

  return (
    <div className="flex flex-col space-y-6 p-4 overflow-y-auto">
      {messages.map((message) => (
        <div key={message.id} className="space-y-4">
          <Message
            content={message.user_message}
            isBot={false}
            timestamp={message.timestamp}
          />
          <Message
            content={message.bot_response}
            isBot={true}
            timestamp={message.timestamp}
          />
        </div>
      ))}
      
      {isLoading && (
        <div className="flex justify-center py-2">
          <div className="flex space-x-2">
            <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce"></div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

Message.propTypes = {
  content: PropTypes.string.isRequired,
  isBot: PropTypes.bool.isRequired,
  timestamp: PropTypes.string.isRequired,
};

MessageList.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    user_message: PropTypes.string.isRequired,
    bot_response: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired,
    topic: PropTypes.number.isRequired,
  })),
  isLoading: PropTypes.bool,
};

export default MessageList;