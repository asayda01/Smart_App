import React from "react";
import "../styles/ErrorDisplay.css";

export const ErrorDisplay = ({ error, onDismiss }) => {
  const handleDismiss = () => {
    // Call the onDismiss function, if needed
    if (onDismiss) onDismiss();
    // Refresh the page
    window.location.reload();
  };

  if (!error) return null;

  return (
    <div className="error-display">
      <p>{error}</p>
      <button onClick={handleDismiss} className="dismiss-button">
        X
      </button>
    </div>
  );
};
