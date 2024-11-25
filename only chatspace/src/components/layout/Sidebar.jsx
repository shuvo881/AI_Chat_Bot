// src/components/layout/Sidebar.jsx
import React, { useState } from 'react';
import { 
  Plus, 
  Trash2,
  ChevronLeft,
  MessageCircle,
  Settings,
  Menu,
  Edit2,
  Loader2,
  RefreshCcw,
  AlertCircle
} from 'lucide-react';
import Button from '../common/Button';
import useTopics from '../../hooks/useTopics';

const NewTopicDialog = ({ onSubmit, onClose, isOpen }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title.trim()) {
      await onSubmit(title.trim());
      setTitle('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="p-4 border-b dark:border-gray-700">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter topic title..."
          className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 
                    bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={!title.trim()}
          >
            Create
          </Button>
        </div>
      </form>
    </div>
  );
};

const SidebarItem = ({ topic, active, onClick, onDelete, onEdit, isCollapsed }) => {
  const [showActions, setShowActions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(topic.title);

  const handleEdit = async (e) => {
    e.stopPropagation();
    if (isEditing) {
      if (editTitle.trim() && editTitle !== topic.title) {
        await onEdit(topic.id, { title: editTitle.trim() });
      }
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  return (
    <div 
      className={`
        group flex items-center gap-3 w-full p-3 rounded-lg cursor-pointer
        transition-colors duration-200
        ${active 
          ? 'bg-blue-500 text-white' 
          : 'hover:bg-gray-100 dark:hover:bg-gray-800'
        }
      `}
      onClick={!isEditing ? onClick : undefined}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <MessageCircle className="w-4 h-4 shrink-0" />
      {!isCollapsed && (
        <>
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="flex-1 bg-transparent border-b border-gray-300 dark:border-gray-600 
                        focus:outline-none focus:border-blue-500"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleEdit(e);
                if (e.key === 'Escape') {
                  setIsEditing(false);
                  setEditTitle(topic.title);
                }
              }}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="text-sm truncate flex-1">{topic.title}</span>
          )}
          
          {showActions && !active && (
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="xs"
                onClick={handleEdit}
                tooltip={isEditing ? "Save" : "Edit title"}
                className="text-gray-500 hover:text-blue-500"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="xs"
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm('Are you sure you want to delete this topic?')) {
                    onDelete(topic.id);
                  }
                }}
                tooltip="Delete conversation"
                className="text-gray-500 hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const Sidebar = ({ className = '' }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showNewTopic, setShowNewTopic] = useState(false);
  const {
    topics,
    activeTopic,
    setActiveTopic,
    isLoading,
    error,
    createTopic,
    deleteTopic,
    updateTopic,
    refreshTopics
  } = useTopics();

  return (
    <div className={`
      flex flex-col h-full border-r dark:border-gray-700
      bg-white dark:bg-gray-900
      transition-all duration-300
      ${isCollapsed ? 'w-[72px]' : 'w-[300px]'}
      ${className}
    `}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
        {!isCollapsed && (
          <h2 className="text-lg font-semibold">Conversations</h2>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-auto"
          tooltip={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <Menu className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* New Topic Dialog */}
      {showNewTopic && !isCollapsed && (
        <NewTopicDialog
          isOpen={showNewTopic}
          onSubmit={createTopic}
          onClose={() => setShowNewTopic(false)}
        />
      )}

      {/* New Chat Button */}
      <div className="p-4">
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={() => setShowNewTopic(true)}
          disabled={isLoading}
        >
          <Plus className="w-4 h-4" />
          {!isCollapsed && <span>New Chat</span>}
        </Button>
      </div>

      {/* Topics List */}
      <div className="flex-1 overflow-y-auto">
        {error && !isCollapsed && (
          <div className="px-4 py-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
            <Button
              variant="ghost"
              size="xs"
              onClick={refreshTopics}
              className="ml-auto"
            >
              <RefreshCcw className="w-4 h-4" />
            </Button>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="p-2">
            {topics.map((topic) => (
              <SidebarItem
                key={topic.id}
                topic={topic}
                active={activeTopic?.id === topic.id}
                onClick={() => setActiveTopic(topic)}
                onDelete={deleteTopic}
                onEdit={updateTopic}
                isCollapsed={isCollapsed}
              />
            ))}
            {topics.length === 0 && !isCollapsed && (
              <div className="text-center text-gray-500 mt-4 text-sm">
                No conversations yet
              </div>
            )}
          </div>
        )}
      </div>

      {/* Settings */}
      <div className="p-4 border-t dark:border-gray-700">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={() => {/* Add settings handler */}}
        >
          <Settings className="w-4 h-4" />
          {!isCollapsed && <span>Settings</span>}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;