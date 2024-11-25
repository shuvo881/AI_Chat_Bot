import React, { useState, useRef } from 'react';
import { Send } from 'lucide-react';
import Button from '../common/Button';
import Textarea from '../common/Textarea';

const ChatInput = ({ onSend, disabled }) => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setError(true);
      return;
    }

    if (!disabled) {
      onSend(message);
      setMessage('');
      setError(false);
      textareaRef.current?.focus();
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="flex gap-3 p-4 border-t dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm"
    >
      <div className="flex-1">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            if (error) setError(false);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder="Type your message..."
          maxLength={500}
          rows={2}
          disabled={disabled}
          error={error}
          errorMessage="Message cannot be empty"
          showCount
          autoFocus
        />
      </div>
      <div className="flex items-center">
        <Button
          type="submit"
          disabled={!message.trim() || disabled}
          loading={disabled}
          variant="default"
          size="md"
          rounded="full"
          className="h-10 w-10 p-0 flex items-center justify-center"
          tooltip="Send message"
          ariaLabel="Send message"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
};

export default ChatInput;