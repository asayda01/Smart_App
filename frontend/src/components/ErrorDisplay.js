// frontend/components/ErrorDisplay.js

import React from "react";
import "../styles/ErrorDisplay.css";

export const ErrorDisplay = ({ error }) => {
  if (!error) return null;

  return (
    <div className="error-display">
      <p>{error}</p>
    </div>
  );
};