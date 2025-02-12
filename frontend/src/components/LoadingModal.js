// src/components/LoadingModal.js

import React from "react";
import "../styles/LoadingModal.css";

export const LoadingModal = ({ message }) => {
  return (
    <div className="loading-modal-overlay">
      <div className="loading-modal">
        <div className="loading-spinner"></div>
        <p>{message}</p>
      </div>
    </div>
  );
};