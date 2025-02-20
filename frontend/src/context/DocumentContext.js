// frontend/src/context/DocumentContext.js

import React, { createContext, useContext, useReducer, useCallback } from "react"; // Import React hooks

const DocumentContext = createContext(); // Create a context for document state

const documentReducer = (state, action) => { // Reducer function to manage state
  switch (action.type) {
    case "SET_DOCUMENTS": // Set documents in state
      return { ...state, documents: action.payload, error: "", loading: false };
    case "ADD_DOCUMENT": // Add a new document to state
      return { ...state, documents: [action.payload, ...state.documents], error: "", loading: false };
    case "REMOVE_DOCUMENT": // Remove a document from state
      return { ...state, documents: state.documents.filter((doc) => doc.id !== action.payload), error: "", loading: false };
    case "SET_ERROR": // Set error message in state
      return { ...state, error: action.payload, loading: false };
    case "CLEAR_ERROR": // Clear error message in state
      return { ...state, error: "", loading: false };
    case "SET_LOADING": // Set loading state
      return { ...state, loading: true };
    default:
      return state; // Return current state by default
  }
};

export const DocumentProvider = ({ children }) => { // Provider component for document context
  const [state, dispatch] = useReducer(documentReducer, { // Initialize state and dispatch
    documents: [], // Initial documents array
    error: "", // Initial error message
    loading: false, // Initial loading state
  });

  const setDocuments = useCallback((documents) => { // Function to set documents
    dispatch({ type: "SET_DOCUMENTS", payload: documents });
  }, []);

  const addDocument = useCallback((document) => { // Function to add a document
    dispatch({ type: "ADD_DOCUMENT", payload: document });
  }, []);

  const removeDocument = useCallback((documentId) => { // Function to remove a document
    dispatch({ type: "REMOVE_DOCUMENT", payload: documentId });
  }, []);

  const setError = useCallback((error) => { // Function to set error
    dispatch({ type: "SET_ERROR", payload: error });
  }, []);

  const clearError = useCallback(() => { // Function to clear error
    dispatch({ type: "CLEAR_ERROR" });
  }, []);

  const setLoading = useCallback((isLoading) => { // Function to set loading state
    dispatch({ type: "SET_LOADING", payload: isLoading });
  }, []);

  return (
    <DocumentContext.Provider // Provide context value to children
      value={{
        documents: state.documents, // Current documents
        error: state.error, // Current error
        loading: state.loading, // Current loading state
        setDocuments, // Function to set documents
        addDocument, // Function to add a document
        removeDocument, // Function to remove a document
        setError, // Function to set error
        clearError, // Function to clear error
        setLoading, // Function to set loading state
      }}
    >
      {children} {/* Render children components */}
    </DocumentContext.Provider>
  );
};

export const useDocuments = () => useContext(DocumentContext); // Custom hook to use document context