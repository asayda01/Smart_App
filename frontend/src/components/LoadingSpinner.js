// frontend/components/LoadingSpinner.js

import React from "react";
import "../styles/LoadingSpinner.css";

export const LoadingSpinner = () => {
  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner"></div>
    </div>
  );
};