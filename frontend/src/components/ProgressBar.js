// frontend/src/components/ProgressBar.js

import React from "react";
import { Box, Typography } from "@mui/material"; // Import Material-UI components for layout and typography
import "../styles/ProgressBar.css"; // Import custom CSS for styling the progress bar

// Define the ProgressBar component and its props
export const ProgressBar = ({ progress, type = "uploading" }) => {
  // Determine the class and label text based on the type
  const progressClass = type === "uploading"
                        ? "uploading" // Class for uploading type
                        : type === "classifying"
                        ? "classifying" // Class for classifying type
                        : "error"; // Class for error type

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      <Typography
        variant="body1"
        sx={{
          color: type === "uploading" ? "#0d47a1"
                : type === "classifying" ? "#1b5e20"
                : "#f44336",
          fontWeight: "bold",
          mb: 1, // Add margin below the label
        }}
      >
      </Typography>
      <div className="progress-bar-container">
        <div className={`progress-bar ${progressClass}`} style={{ width: `${progress}%` }}>
          <div className="progress-text">{progress}%</div>
        </div>
      </div>
    </Box>
  );
};
