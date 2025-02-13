// frontend/src/components/Upload.js

import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { uploadFile } from "../services/api";
import { useDocuments } from "../context/DocumentContext";
import { LoadingSpinner } from "./LoadingSpinner";
import "../styles/Upload.css";

export const Upload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { addDocument, setError } = useDocuments();

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const response = await uploadFile(file, (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(percentCompleted);
      });
      addDocument(response);
      setError("");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: ".txt" });

  return (
    <div {...getRootProps()} className={`dropzone ${isDragActive ? "active" : ""}`}>
      <input {...getInputProps()} />
      {isUploading ? (
        <LoadingSpinner />
      ) : (
        <p>{isDragActive ? "Drop the file here..." : "Drag & drop a .txt, .pdf, and .docx file here, or click to select one"}</p>
      )}
    </div>
  );
};