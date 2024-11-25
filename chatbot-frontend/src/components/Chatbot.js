// src/components/Chatbot.js
import React, { useState } from 'react';
import {
  MainContainer,
  Sidebar,
  ConversationList,
  Conversation,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from '@chatscope/chat-ui-kit-react';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      message: 'Hello! How can I assist you today?',
      sentTime: 'just now',
      sender: 'ChatGPT',
      direction: 'incoming',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [activeConversation, setActiveConversation] = useState('1');

  const conversations = [
    { id: '1', name: 'General Inquiry' },
    { id: '2', name: 'Technical Support' },
    { id: '3', name: 'Billing' },
  ];

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: 'user',
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setIsTyping(true);

    // Simulate a response from the chatbot
    setTimeout(() => {
      const botResponse = {
        message: "I'm here to help you with your queries.",
        sender: 'ChatGPT',
        direction: 'incoming',
      };
      setMessages((prevMessages) => [...prevMessages, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleConversationClick = (id) => {
    setActiveConversation(id);
    // Load messages for the selected conversation
    // For demonstration, we'll reset messages
    setMessages([
      {
        message: `You have selected the ${conversations.find((c) => c.id === id).name} conversation.`,
        sentTime: 'just now',
        sender: 'ChatGPT',
        direction: 'incoming',
      },
    ]);
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <MainContainer responsive>
        <Sidebar position="left" scrollable>
          <ConversationList>
            {conversations.map((conv) => (
              <Conversation
                key={conv.id}
                name={conv.name}
                active={conv.id === activeConversation}
                onClick={() => handleConversationClick(conv.id)}
              />
            ))}
          </ConversationList>
        </Sidebar>
        <ChatContainer>
          <MessageList
            typingIndicator={
              isTyping ? <TypingIndicator content="ChatGPT is typing" /> : null
            }
          >
            {messages.map((msg, i) => (
              <Message
                key={i}
                model={{
                  message: msg.message,
                  sentTime: msg.sentTime,
                  sender: msg.sender,
                  direction: msg.direction,
                  position: 'single',
                }}
              />
            ))}
          </MessageList>
          <MessageInput
            placeholder="Type your message here..."
            onSend={handleSend}
            attachButton={false}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
};

export default Chatbot;
