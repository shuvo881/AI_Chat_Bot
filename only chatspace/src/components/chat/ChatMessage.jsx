// src/components/chat/ChatMessage.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { User, Bot, Copy, Check } from 'lucide-react';
import Button from '../common/Button';

// Time formatting helper
const formatMessageTime = (timestamp) => {
  try {
    const now = new Date();
    const messageDate = new Date(timestamp);
    
    // Check if invalid date
    if (isNaN(messageDate.getTime())) {
      return '';
    }

    // If message is from today, show only time
    if (messageDate.toDateString() === now.toDateString()) {
      return messageDate.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    }

    // If message is from yesterday
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday ' + messageDate.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true
      });
    }

    // If message is from this year, show date without year
    if (messageDate.getFullYear() === now.getFullYear()) {
      return messageDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    }

    // For older messages, show full date
    return messageDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    console.error('Time formatting error:', error);
    return '';
  }
};

const ChatMessage = ({ message, isBot }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };

  return (
    <div className={`group flex gap-3 ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
      {/* Avatar */}
      <div className={`
        h-8 w-8 rounded-full flex items-center justify-center shrink-0
        ${isBot 
          ? 'bg-blue-100 dark:bg-blue-900' 
          : 'bg-green-100 dark:bg-green-900'
        }
      `}>
        {isBot ? (
          <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        ) : (
          <User className="w-4 h-4 text-green-600 dark:text-green-400" />
        )}
      </div>

      {/* Message content */}
      <div className={`flex flex-col gap-1 max-w-[80%] ${isBot ? 'items-start' : 'items-end'}`}>
        {/* Sender name and time */}
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {isBot ? 'Assistant' : 'You'}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500 min-w-[65px]">
            {formatMessageTime(message.timestamp)}
          </span>
        </div>

        {/* Message bubble */}
        <div className="group relative">
          <div className={`
            rounded-lg px-4 py-2 
            ${isBot 
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100' 
              : 'bg-blue-500 text-white'
            }
          `}>
            {message.content}
          </div>

          {/* Copy button */}
          <Button
            variant="ghost"
            size="xs"
            onClick={handleCopy}
            className={`
              absolute top-1 ${isBot ? 'right-1' : 'left-1'}
              opacity-0 group-hover:opacity-100 transition-opacity
              ${isBot ? 'text-gray-500 hover:text-gray-700' : 'text-white'}
            `}
            tooltip={copied ? 'Copied!' : 'Copy message'}
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

ChatMessage.propTypes = {
  message: PropTypes.shape({
    content: PropTypes.string.isRequired,
    timestamp: PropTypes.string,
  }).isRequired,
  isBot: PropTypes.bool.isRequired,
};

export default ChatMessage;