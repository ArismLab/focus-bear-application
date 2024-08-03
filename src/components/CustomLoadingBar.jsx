import React from 'react';
import './CustomLoadingBar.css';

const CustomLoadingBar = ({ progress }) => {
  return (
    <div className="custom-loading-bar">
      <div className="custom-loading-bar-empty">
        <div
          className="custom-loading-bar-full"
          style={{ width: `${progress * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default CustomLoadingBar;
