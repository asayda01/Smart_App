// frontend/src/components/Upload.js

import React, { useState } from "react";
import { useDropzone } from "react-dropzone"; // Import dropzone hook for file drag-and-drop
import { uploadFile } from "../services/api"; // Import file upload API function
import { useDocuments } from "../context/DocumentContext"; // Import context for managing uploaded documents
import { ProgressBar } from "./ProgressBar"; // Import ProgressBar component for showing upload progress
import { Typography, Box } from "@mui/material"; // Import Material-UI components for styling
import { CloudUpload } from "@mui/icons-material"; // Import cloud upload icon for UI
import { motion, AnimatePresence } from "framer-motion"; // Import animations for UI transitions
import "../styles/Upload.css"; // Import styles for upload component

export const Upload = () => {
  const [isUploading, setIsUploading] = useState(false); // State to track if file is being uploaded
  const [uploadProgress, setUploadProgress] = useState(0); // State for upload progress percentage
  const [classificationProgress, setClassificationProgress] = useState(0); // State for classification progress
  const { addDocument, setError } = useDocuments(); // Get document context functions
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // Set max file size to 10MB

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0]; // Get the first dropped file
    if (!file) return; // Return if no file is selected

    // Check if the file is empty
    if (file.size === 0) {
      setError("This file appears to be empty. Please upload a valid file.");
      return;
    }

    // Set error for large files
    if (file.size > MAX_FILE_SIZE) {
      setError("File size exceeds the maximum limit of 10MB.");
      return;
    }

    setIsUploading(true); // Set uploading state to true
    setUploadProgress(0); // Reset upload progress
    setClassificationProgress(0); // Reset classification progress

    try {
      const uploadResponse = await uploadFile(file, (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percentCompleted); // Update progress based on file upload
      });

      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setClassificationProgress(progress); // Simulate classification progress in intervals
        if (progress >= 100) {
          clearInterval(interval); // Stop when progress reaches 100%
          addDocument(uploadResponse); // Add uploaded document to context
          setError(""); // Clear any previous errors
          setIsUploading(false); // Reset uploading state
        }
      }, 200);
    } catch (error) {
          // Check for corrupted file error from backend
          if (error.response && error.response.data.detail) {
            if (error.response.data.detail === "This file appears to be corrupted. Please upload a valid file.") {
              setError("This file appears to be corrupted. Please upload a valid file.");
            } else {
              setError(error.response.data.detail || "Failed to upload file.");
            }
          } else {
            setError(error.message || "Failed to upload file.");
          }
          setIsUploading(false); // Reset uploading state on error
        }
      };

  // Configure dropzone properties and file type restrictions
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected: (fileRejections) => {
      setError("Invalid file type. Please upload a .txt, .pdf, or .docx file.");
    },
    accept: {
      "text/plain": [".txt"],
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    }
  });

  return (
    <Box className="upload-container">
      {/* Dropzone container */}
      <Box
        {...getRootProps()}
        className={`dropzone ${isDragActive ? "active" : ""}`} // Apply active class when dragging
        sx={{
          border: "2px dashed #1976d2",
          borderRadius: "8px",
          padding: "20px",
          textAlign: "center",
          cursor: "pointer",
          backgroundColor: isDragActive ? "#e3f2fd" : "#f5f5f5",
          transition: "background-color 0.3s ease",
        }}
      >
        <input {...getInputProps()} /> {/* Hidden file input for manual selection */}
        {isUploading ? ( // Show progress UI if uploading
          <Box className="upload-progress-container">
            <Typography variant="h6" gutterBottom>
              Uploading... {uploadProgress}%
            </Typography>
            <ProgressBar progress={uploadProgress} type="uploading" /> {/* Upload progress bar */}
            <Typography variant="h6" gutterBottom>
              Classifying... {classificationProgress}%
            </Typography>
            <ProgressBar progress={classificationProgress} type="classifying" /> {/* Classification progress bar */}
          </Box>
        ) : ( // Show upload prompt when not uploading
          <Box>
            <CloudUpload fontSize="large" color="primary" />
            <Typography variant="h6" gutterBottom>
              {isDragActive ? "Drop the file here..." : "Drag & drop or click to upload a file"} {/* Dragging hint */}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Only .txt, .pdf and .docx files are supported
            </Typography>
          </Box>
        )}
      </Box>

      {/* Uploading animation */}
      <AnimatePresence>
        {isUploading && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="uploading-alert"
          >
            <Typography variant="body1" sx={{ color: "white" }}>
              Processing your file, please wait...
            </Typography>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};
