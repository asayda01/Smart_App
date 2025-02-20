// frontend/components/LoadingSpinner.js

import React from "react";
import { CircularProgress, Box } from '@mui/material'; // Import CircularProgress and Box components from Material-UI
import "../styles/LoadingSpinner.css"; // Import CSS styles for the loading spinner

// Define the LoadingSpinner functional component
export const LoadingSpinner = () => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      {/* Create a Box that centers its content vertically and horizontally, with full viewport height */}
      <CircularProgress />
      {/* Render a CircularProgress spinner to indicate loading status */}
    </Box>
  );
};
