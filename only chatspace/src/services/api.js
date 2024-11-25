// src/services/api.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'An unexpected error occurred';
    console.error('API Error:', error);
    return Promise.reject(new Error(message));
  }
);

export const chatApi = {
  // Topics
  getTopics: async () => {
    try {
      return await axiosInstance.get('/topics/');
    } catch (error) {
      throw error;
    }
  },

  createTopic: async (title) => {
    try {
      return await axiosInstance.post('/topics/', {
        topic: title, // Match API format
        create_by: localStorage.getItem('userId') || null // Add user ID if available
      });
    } catch (error) {
      throw error;
    }
  },

  updateTopic: async (topicId, updates) => {
    try {
      return await axiosInstance.patch(`/topics/${topicId}/`, {
        topic: updates.topic // Match API format
      });
    } catch (error) {
      throw error;
    }
  },

  deleteTopic: async (topicId) => {
    try {
      return await axiosInstance.delete(`/topics/${topicId}/`);
    } catch (error) {
      throw error;
    }
  },

  // Messages
  getMessages: async (topicId) => {
    try {
      return await axiosInstance.get(`/topics/${topicId}/messages/`);
    } catch (error) {
      throw error;
    }
  },

  sendMessage: async (topicId, content) => {
    try {
      return await axiosInstance.post(`/topics/${topicId}/messages/`, {
        user_message: content
      });
    } catch (error) {
      throw error;
    }
  }
};

export default chatApi;