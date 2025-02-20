// frontend/components/LoadingSpinner.js

import React from "react";
import { CircularProgress, Box } from '@mui/material';
import "../styles/LoadingSpinner.css";

export const LoadingSpinner = () => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <CircularProgress />
    </Box>
  );
};
