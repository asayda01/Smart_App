// frontend/src/components/Upload.js

import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { uploadFile } from "../services/api";
import { useDocuments } from "../context/DocumentContext";
import { ProgressBar } from "./ProgressBar";
import { Typography, Box } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/Upload.css";

export const Upload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [classificationProgress, setClassificationProgress] = useState(0);
  const { addDocument, setError } = useDocuments();
  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setError("File size exceeds the maximum limit of 10MB.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setClassificationProgress(0);

    try {
      const uploadResponse = await uploadFile(file, (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percentCompleted);
      });

      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setClassificationProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          addDocument(uploadResponse);
          setError("");
          setIsUploading(false);
        }
      }, 200);
    } catch (error) {
      setError(error.message);
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: {
    "text/plain": [".txt"],
    "application/pdf": [".pdf"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"]
  } });

  return (
    <Box className="upload-container">
      <Box
        {...getRootProps()}
        className={`dropzone ${isDragActive ? "active" : ""}`}
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
        <input {...getInputProps()} />
        {isUploading ? (
          <Box className="upload-progress-container">
            <Typography variant="h6" gutterBottom>
              Uploading... {uploadProgress}%
            </Typography>
            <ProgressBar progress={uploadProgress} type="uploading" />
            <Typography variant="h6" gutterBottom>
              Classifying... {classificationProgress}%
            </Typography>
            <ProgressBar progress={classificationProgress} type="classifying" />
          </Box>
        ) : (
          <Box>
            <CloudUpload fontSize="large" color="primary" />
            <Typography variant="h6" gutterBottom>
              {isDragActive ? "Drop the file here..." : "Drag & drop or click to upload a file"}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Only .txt, .pdf and .docx files are supported
            </Typography>
          </Box>
        )}
      </Box>

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