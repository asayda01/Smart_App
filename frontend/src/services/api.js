// frontend/services/api.js

import axios from "axios";

const API_URL = "http://localhost:8000";

const api = axios.create({
  baseURL: API_URL,
});

const acceptedFileTypes = [".txt", ".pdf", ".docx"];

export const fetchDocuments = async () => {
  try {
    const response = await api.get("/documents/");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch documents. Please check your network connection.");
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
    throw new Error(error.message || "Failed to upload file. Please check your network connection.");
  }
};
