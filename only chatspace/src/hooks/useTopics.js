// src/hooks/useTopics.js
import { useState, useCallback, useEffect } from 'react';
import chatApi from '../services/api';

// Transform API topic to internal format
const transformTopic = (apiTopic) => ({
  id: apiTopic.id,               // Keep as number
  title: apiTopic.topic,         // Map 'topic' to 'title'
  createdAt: apiTopic.create_at,
  createdBy: apiTopic.create_by
});

export const useTopics = () => {
  const [topics, setTopics] = useState([]);
  const [activeTopic, setActiveTopic] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch topics
  const fetchTopics = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Fetching topics...');  // Debug log
      const response = await chatApi.getTopics();
      console.log('API Response:', response);  // Debug log

      // Transform and sort topics by creation date (newest first)
      const transformedTopics = response
        .map(transformTopic)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      console.log('Transformed topics:', transformedTopics);  // Debug log
      setTopics(transformedTopics);
      
      // Set first topic as active if none selected
      if (!activeTopic && transformedTopics.length > 0) {
        console.log('Setting initial active topic:', transformedTopics[0]);  // Debug log
        setActiveTopic(transformedTopics[0]);
      }
    } catch (error) {
      console.error('Error fetching topics:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [activeTopic]);

  // Create new topic
  const createTopic = async (title) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await chatApi.createTopic(title);
      const newTopic = transformTopic(response);
      console.log('New topic created:', newTopic);  // Debug log
      
      setTopics(prev => [newTopic, ...prev]);
      setActiveTopic(newTopic);
      return newTopic;
    } catch (error) {
      console.error('Error creating topic:', error);
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Update topic
  const updateTopic = async (topicId, updates) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await chatApi.updateTopic(topicId, { topic: updates.title });
      const updatedTopic = transformTopic(response);
      console.log('Topic updated:', updatedTopic);  // Debug log
      
      setTopics(prev => prev.map(topic => 
        topic.id === topicId ? updatedTopic : topic
      ));
      if (activeTopic?.id === topicId) {
        setActiveTopic(updatedTopic);
      }
    } catch (error) {
      console.error('Error updating topic:', error);
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete topic
  const deleteTopic = async (topicId) => {
    setIsLoading(true);
    setError(null);

    try {
      await chatApi.deleteTopic(topicId);
      console.log('Topic deleted:', topicId);  // Debug log
      
      setTopics(prev => prev.filter(topic => topic.id !== topicId));
      if (activeTopic?.id === topicId) {
        const remainingTopics = topics.filter(topic => topic.id !== topicId);
        setActiveTopic(remainingTopics[0] || null);
      }
    } catch (error) {
      console.error('Error deleting topic:', error);
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Set active topic with validation
  const handleSetActiveTopic = useCallback((topic) => {
    console.log('Setting active topic:', topic);  // Debug log
    if (topic && topic.id) {
      setActiveTopic(topic);
    }
  }, []);

  // Fetch topics on mount
  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  return {
    topics,
    activeTopic,
    setActiveTopic: handleSetActiveTopic,
    isLoading,
    error,
    createTopic,
    updateTopic,
    deleteTopic,
    refreshTopics: fetchTopics
  };
};

export default useTopics;