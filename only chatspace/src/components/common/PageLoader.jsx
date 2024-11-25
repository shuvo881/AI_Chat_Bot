// src/components/common/PageLoader.jsx
import React from 'react';
import Loader from './Loader';

const PageLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-50">
      <div className="text-center">
        <Loader size="large" text="Loading..." />
      </div>
    </div>
  );
};

export default PageLoader;