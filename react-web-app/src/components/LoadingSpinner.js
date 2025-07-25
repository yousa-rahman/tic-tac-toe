import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="loading-container" data-testid="loading-spinner">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
};

export default LoadingSpinner; 