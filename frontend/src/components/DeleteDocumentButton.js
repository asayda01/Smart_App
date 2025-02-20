// frontend/src/components/deleteDocumentButton.js

import React from "react";
import { deleteDocumentApi } from "../services/api";
import "../styles/deleteDocument.css";

const DeleteDocumentButton = ({ docId, fileName, onDelete }) => {
  const handleDelete = async () => {
    // Confirmation dialog
    const isConfirmed = window.confirm(`Do you want to delete "${fileName}"?`);

    if (isConfirmed) {
      try {
        await deleteDocumentApi(docId);
        onDelete(docId); // Calls removeDocument from context
      } catch (error) {
        alert("Failed to delete document");
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      style={{
        backgroundColor: "red",
        color: "white",
        padding: "10px",
        border: "none",
        cursor: "pointer",
        borderRadius: "5px",
        marginTop: "10px",
      }}
    >
      Delete This Document
    </button>
  );
};

export default DeleteDocumentButton;