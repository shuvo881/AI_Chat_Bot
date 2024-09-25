import React, { useState } from 'react';
import ChatList from './ChatList';
import axiosInstance from '../services/axios';

const Chatbot = () => {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Function to select an existing chat topic
  const selectChat = async (topicId) => {
    try {
      const response = await axiosInstance.get(`/topics/${topicId}/messages/`);
      setMessages(response.data);
      setSelectedTopic(topicId);
      setError('');
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      setError('Failed to load chat messages.');
    }
  };

  // Function to send a new message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);

    try {
      // If a topic is selected, send message to existing topic, else create a new topic
      const endpoint = selectedTopic
        ? `/topics/${selectedTopic}/messages/`
        : `/topics/messages/`;  // When no topic is selected, the backend will create a new one

      const response = await axiosInstance.post(endpoint, {
        user_message: input,
      });

      // If no topic was selected, the backend will create a new topic, so set the new topic
      if (!selectedTopic) {
        setSelectedTopic(response.data.topic);  // Assuming the response includes the new topic ID
      }

      setMessages([response.data, ...messages]);  // Add new message to the chat
      setInput('');  // Clear the input field
      setError('');
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <ChatList selectChat={selectChat} />
      <div className="flex flex-col w-3/4 bg-white p-6">
        <div className="flex-grow h-96 overflow-y-auto bg-gray-50 p-4 rounded-lg mb-4">
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <div key={index} className="mb-4">
                <p className="text-gray-800">
                  <strong>User:</strong> {message.user_message}
                </p>
                <p className="text-gray-500">
                  <strong>Bot:</strong> {message.bot_response}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No messages yet.</p>
          )}
        </div>

        {/* Error display */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Message input form */}
        <form onSubmit={sendMessage} className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none"
            disabled={loading}
          />
          <button
            type="submit"
            className={`ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
