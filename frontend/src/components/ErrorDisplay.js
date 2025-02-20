// frontend/src/components/ErrorDisplay.js

import React from "react";
import "../styles/ErrorDisplay.css"; // Import CSS styles for the error display component

export const ErrorDisplay = ({ error, onDismiss }) => {
  // Function to handle the dismissal of the error message
  const handleDismiss = () => {
    // Call the onDismiss function if provided
    if (onDismiss) onDismiss();
    // Refresh the page after dismissing the error
    window.location.reload();
  };

  // If no error is provided, render nothing
  if (!error) return null;

  // Render the error message and a dismiss button
  return (
    <div className="error-display"> {/* Main container for error display */}
      <p>{error}</p> {/* Display the error message */}
      <button onClick={handleDismiss} className="dismiss-button"> {/* Button to dismiss the error */}
        X {/* Button text */}
      </button>
    </div>
  );
};
