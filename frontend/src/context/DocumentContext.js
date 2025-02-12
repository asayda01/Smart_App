// frontend/src/context/DocumentContext.js

import React, { createContext, useContext, useReducer, useCallback } from "react";

const DocumentContext = createContext();

const documentReducer = (state, action) => {
  switch (action.type) {
    case "SET_DOCUMENTS":
      return { ...state, documents: action.payload, error: "" };
    case "ADD_DOCUMENT":
      return { ...state, documents: [action.payload, ...state.documents], error: "" };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "CLEAR_ERROR":
      return { ...state, error: "" };
    default:
      return state;
  }
};

export const DocumentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(documentReducer, {
    documents: [],
    error: "",
  });

  const setDocuments = useCallback((documents) => {
    dispatch({ type: "SET_DOCUMENTS", payload: documents });
  }, []);

  const addDocument = useCallback((document) => {
    dispatch({ type: "ADD_DOCUMENT", payload: document });
  }, []);

  const setError = useCallback((error) => {
    dispatch({ type: "SET_ERROR", payload: error });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: "CLEAR_ERROR" });
  }, []);

  return (
    <DocumentContext.Provider
      value={{
        documents: state.documents,
        error: state.error,
        setDocuments,
        addDocument,
        setError,
        clearError,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocuments = () => useContext(DocumentContext);