// src/App.jsx
import React from 'react';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import ChatWindow from './components/chat/ChatWindow';
import Footer from './components/layout/Footer';
import { ChatProvider } from './context/ChatContext';
import useTopics from './hooks/useTopics';

const App = () => {
  const {
    topics,
    activeTopic,
    setActiveTopic,
    isLoading: isTopicsLoading,
    createTopic,
    deleteTopic,
    updateTopic,
    refreshTopics
  } = useTopics();

  return (
    <ChatProvider>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        {/* Fixed Header */}
        <Header className="fixed top-0 left-0 right-0 z-50" />
        
        <div className="flex-1 pt-16 pb-16"> {/* Space for header and footer */}
          {/* Fixed Sidebar */}
          <div className="fixed left-0 top-16 bottom-16 z-40">
            <Sidebar
              topics={topics}
              activeTopic={activeTopic}
              onTopicSelect={setActiveTopic}
              onNewTopic={createTopic}
              onDeleteTopic={deleteTopic}
              onUpdateTopic={updateTopic}
              isLoading={isTopicsLoading}
              onRefresh={refreshTopics}
            />
          </div>

          {/* Main Content Area */}
          <div className="transition-all duration-300 h-full pl-[300px]">
            <div className="h-full p-4">
              <ChatWindow 
                key={activeTopic?.id}
                topic={activeTopic}
                className="h-full"
              />
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <Footer className="fixed bottom-0 left-0 right-0 z-50" />
      </div>
    </ChatProvider>
  );
};

export default App;