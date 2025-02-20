// frontend/src/components/LoadingModal.js

import React from "react";
import "../styles/LoadingModal.css"; // Import the CSS styles for the loading modal

// Define the LoadingModal functional component that accepts a message prop
export const LoadingModal = ({ message }) => {
  return (
    <div className="loading-modal-overlay"> {/* Overlay to cover the entire screen */}
      <div className="loading-modal"> {/* Modal container for the loading indicator */}
        <div className="loading-spinner"></div> {/* Spinner element to show loading animation */}
        <p>{message}</p> {/* Display the loading message */}
      </div>
    </div>
  );
};
