// frontend/src/components/deleteDocumentButton.js

import React from "react";
import { deleteDocumentApi } from "../services/api"; // Import API function to delete document
import "../styles/deleteDocument.css"; // Import CSS styles

const DeleteDocumentButton = ({ docId, fileName, onDelete }) => { // Component to delete a document
  const handleDelete = async () => { // Function to handle delete action
    const isConfirmed = window.confirm(`Do you want to delete "${fileName}"?`); // Confirm deletion
    if (isConfirmed) {
      try {
        await deleteDocumentApi(docId); // Call API to delete document
        onDelete(docId); // Call onDelete callback to update state
      } catch (error) {
        alert("Failed to delete document"); // Show error message
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

export default DeleteDocumentButton; // Export DeleteDocumentButton component