import React, { useEffect, useState } from 'react';
import axiosInstance from '../services/axios';

const ChatList = ({ selectChat }) => {
  const [chatTopics, setChatTopics] = useState([]);
  const [newTopic, setNewTopic] = useState(''); // State for new topic input

  useEffect(() => {
    const fetchChatTopics = async () => {
      try {
        const response = await axiosInstance.get('/topics/');
        setChatTopics(response.data);
      } catch (error) {
        console.error('Error fetching chat topics:', error);
      }
    };

    fetchChatTopics();
  }, []);

  // Function to handle creating a new topic
  const handleNewTopic = async (e) => {
    e.preventDefault();

    if (!newTopic) {
      alert('Please enter a topic');
      return;
    }

    try {
      const response = await axiosInstance.post('/topics/', { topic: newTopic });
      setChatTopics([...chatTopics, response.data]); // Add the new topic to the list
      setNewTopic(''); // Reset the input field
    } catch (error) {
      console.error('Error creating new chat topic:', error);
    }
  };

  return (
    <div className="w-1/4 bg-gray-200 h-screen p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Chat Topics</h2>

      {/* New Topic Form */}
      <form onSubmit={handleNewTopic} className="mb-4">
        <input
          type="text"
          value={newTopic}
          onChange={(e) => setNewTopic(e.target.value)}
          placeholder="Enter new topic"
          className="border p-2 w-full mb-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-lg w-full"
        >
          Create New Topic
        </button>
      </form>

      {/* Chat Topics List */}
      {chatTopics.length === 0 ? (
        <p>No chat topics yet</p>
      ) : (
        <ul>
          {chatTopics.map((topic, index) => (
            <li
              key={index}
              onClick={() => selectChat(topic.id)}
              className="p-2 bg-white mb-2 cursor-pointer hover:bg-gray-300 rounded-lg"
            >
              <strong>{topic.topic}</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChatList;