import React, { useEffect, useState } from 'react';
import axiosInstance from '../services/axios';

const ChatList = ({ selectChat }) => {
  const [chatTopics, setChatTopics] = useState([]);

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

  return (
    <div className="w-1/4 bg-gray-200 h-screen p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Chat Topics</h2>
      {chatTopics.length === 0 ? (
        <p>No chat topics yet</p>
      ) : (
        <ul>
          {chatTopics.map((topic, index) => (
            <li key={index} onClick={() => selectChat(topic.id)} className="p-2 bg-white mb-2 cursor-pointer hover:bg-gray-300 rounded-lg">
              <strong>{topic.topic}</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChatList;
