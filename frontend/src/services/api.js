// frontend/services/api.js

import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_URL
//    timeout: 10000, // 10 seconds
//  timeout: 600000, // 1 minute
});

const acceptedFileTypes = [".txt", ".pdf", ".docx"];

export const fetchDocuments = async (page = 1) => {
  try {
    const response = await api.get(`/documents/?page=${page}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch documents. Please check your network connection.");
  }
};

export const uploadFile = async (file, onUploadProgress) => {
  try {
    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (!acceptedFileTypes.includes(`.${fileExtension}`)) {
      throw new Error("Invalid file type. Only .txt, .pdf, and .docx files are allowed.");
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/upload/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress,
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to upload file. Please check your network connection.");
  }
};

export const deleteDocumentApi = async (docId) => {
    try {
        const response = await api.delete(`/documents/${docId}/`);
        return response.data;
    } catch (error) {
        throw new Error(error.message || "Failed to delete document. Please check your network connection.");
    }
};