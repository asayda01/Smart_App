// frontend/components/ProgressBar.js

import React from "react";
import "../styles/ProgressBar.css";

export const ProgressBar = ({ progress }) => {
  return (
    <div className="progress-bar-container">
      <div className="progress-bar" style={{ width: `${progress}%` }}></div>
    </div>
  );
};