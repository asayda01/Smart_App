// frontend/src/context/DocumentContext.js

import React, { createContext, useContext, useReducer, useCallback } from "react";

const DocumentContext = createContext();

const documentReducer = (state, action) => {
  switch (action.type) {
    case "SET_DOCUMENTS":
      return { ...state, documents: action.payload, error: "", loading: false };
    case "ADD_DOCUMENT":
      return { ...state, documents: [action.payload, ...state.documents], error: "", loading: false };
    case "REMOVE_DOCUMENT":
      return {
        ...state,
        documents: state.documents.filter((doc) => doc.id !== action.payload),
        error: "",
        loading: false,
      };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "CLEAR_ERROR":
      return { ...state, error: "", loading: false };
    case "SET_LOADING":
      return { ...state, loading: true };
    default:
      return state;
  }
};

export const DocumentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(documentReducer, {
    documents: [],
    error: "",
    loading: false,
  });

  const setDocuments = useCallback((documents) => {
    dispatch({ type: "SET_DOCUMENTS", payload: documents });
  }, []);

  const addDocument = useCallback((document) => {
    dispatch({ type: "ADD_DOCUMENT", payload: document });
  }, []);

  const removeDocument = useCallback((documentId) => {
    dispatch({ type: "REMOVE_DOCUMENT", payload: documentId });
  }, []);

  const setError = useCallback((error) => {
    dispatch({ type: "SET_ERROR", payload: error });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: "CLEAR_ERROR" });
  }, []);

  const setLoading = useCallback((isLoading) => {
    dispatch({ type: "SET_LOADING", payload: isLoading });
  }, []);

  return (
    <DocumentContext.Provider
      value={{
        documents: state.documents,
        error: state.error,
        loading: state.loading,
        setDocuments,
        addDocument,
        removeDocument,
        setError,
        clearError,
        setLoading,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocuments = () => useContext(DocumentContext);