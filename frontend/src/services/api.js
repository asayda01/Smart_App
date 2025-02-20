// frontend/services/api.js

import axios from "axios"; // Import Axios for HTTP requests

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000"; // Set API URL from env or default to localhost

const api = axios.create({ baseURL: API_URL }); // Create Axios instance with base URL

const acceptedFileTypes = [".txt", ".pdf", ".docx"]; // Define accepted file types

export const fetchDocuments = async (page = 1) => { // Fetch documents from the API
  try {
    const response = await api.get(`/documents/?page=${page}`); // GET request to fetch documents
    return response.data; // Return fetched data
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch documents."); // Handle errors
  }
};

export const uploadFile = async (file, onUploadProgress) => { // Upload a file to the API
  try {
    const fileExtension = file.name.split(".").pop().toLowerCase(); // Get file extension
    if (!acceptedFileTypes.includes(`.${fileExtension}`)) { // Check if file type is accepted
      throw new Error("Invalid file type."); // Throw error if file type is invalid
    }

    const formData = new FormData(); // Create FormData object
    formData.append("file", file); // Append file to FormData
    const response = await api.post("/upload/", formData, { // POST request to upload file
      headers: { "Content-Type": "multipart/form-data" }, // Set headers
      onUploadProgress, // Track upload progress
    });
    return response.data; // Return response data
  } catch (error) {
    // Handle corrupted file error from the backend
    if (error.response && error.response.data && error.response.data.detail) {
      throw new Error(error.response.data.detail); // Use the error detail from the backend
    }
    throw new Error("Failed to upload file."); // Fallback to a generic error
  }
};

export const deleteDocumentApi = async (docId) => { // Delete a document by ID
  try {
    const response = await api.delete(`/documents/${docId}/`); // DELETE request to remove document
    return response.data; // Return response data
  } catch (error) {
    throw new Error(error.message || "Failed to delete document."); // Handle errors
  }
};