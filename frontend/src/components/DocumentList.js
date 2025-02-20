// frontend/src/components/DocumentList.js

import React, { useEffect, useState, useRef } from "react";
import { useDocuments } from "../context/DocumentContext"; // Access document context state and actions
import { fetchDocuments } from "../services/api"; // Import API call for fetching documents
import { DocumentCard } from "./DocumentCard"; // Import DocumentCard component to render document details
import { LoadingSpinner } from "./LoadingSpinner"; // Import loading spinner component for loading state
import { Pagination } from "./Pagination"; // Import pagination component for navigating document pages
import { ErrorDisplay } from "./ErrorDisplay"; // Import error display component for showing errors
import "../styles/DocumentList.css"; // Import styles specific to DocumentList component
import "../styles/Common.css"; // Import common styles shared across components
import { sortDocuments } from "./sortDocuments"; // Import utility function for sorting documents

export const DocumentList = () => {
  // Set up state and context
  const { documents, setDocuments, error, setError, loading, removeDocument } = useDocuments();
  const [expandedDocumentId, setExpandedDocumentId] = useState(null); // State to track currently expanded document
  const [isLoading, setIsLoading] = useState(false); // State to track loading state while fetching documents
  const [currentPage, setCurrentPage] = useState(1); // State for current page in pagination
  const [documentsPerPage] = useState(9); // Number of documents to display per page
  const [sortOption, setSortOption] = useState("upload_time_desc"); /* default: Sort by upload time in descending order */
  const hasFetched = useRef(false); // Ref to track if data has been fetched

  useEffect(() => {
    // Effect to fetch documents on component mount
    if (hasFetched.current) return; // Prevent fetching if data has already been fetched
    hasFetched.current = true; // Set ref to prevent future fetches

    const fetchData = async () => {
      // Async function to fetch documents
      setIsLoading(true); // Set loading state before fetching
      try {
        const data = await fetchDocuments(); // Fetch documents from API
        setDocuments(data); // Set fetched documents in context
        setError(""); // Clear any previous errors
      } catch (err) {
        setError("Failed to fetch documents. Please check your network connection.");
      } finally {
        setIsLoading(false); // Reset loading state after fetch completion
      }
    };

    fetchData(); // Call the fetch data function
  }, [setDocuments, setError]); // Dependencies array

  const handleToggle = (docId) => {
    // Function to toggle the expanded state of a document card
    setExpandedDocumentId(expandedDocumentId === docId ? null : docId); // Switch expanded state
  };

  const handleDelete = async (docId) => {
    // Async function to handle document deletion
    try {
      removeDocument(docId); // Attempt to remove document from context
    } catch (err) {
      setError("Failed to delete document. Please try again."); // Set error message on failure
    }
  };

  const handleSortChange = (e) => {
    // Function to handle sort option change
    setSortOption(e.target.value); // Update sort option based on user selection
  };

  const sortedDocuments = sortDocuments(documents, sortOption); // Sort documents based on selected option

  // Calculate indices for pagination
  const indexOfLastDocument = currentPage * documentsPerPage; // Last document index for current page
  const indexOfFirstDocument = indexOfLastDocument - documentsPerPage; // First document index for current page
  const currentDocuments = sortedDocuments.slice(indexOfFirstDocument, indexOfLastDocument); // Get current documents for display

  const paginate = (pageNumber) => setCurrentPage(pageNumber); // Function to change the current page

  // Determine what message to display based on loading/error states
  let message;
  if (loading || isLoading) {
    message = <div className="loading-message"> Loading Please Wait</div>;
  } else if (error) {
    message = <ErrorDisplay error={error} />;
  } else if (documents.length === 0) {
    message = <div className="no-data-message">No data found. Please add a document to render.</div>;
  }

  return (
    <div className="mt-6">
      <h2 className="uploaded-documents-title">Uploaded Documents</h2>

      <div className="sort-dropdown">
        <label htmlFor="sort">Sort by: </label>
        <select id="sort" value={sortOption} onChange={handleSortChange}>
          <option value="filename_asc">Filename (A -> Z)</option>
          <option value="filename_desc">Filename (Z -> A)</option>
          <option value="category">Category</option>
          <option value="upload_time_asc">Upload Time (Oldest to Latest)</option>
          <option value="upload_time_desc">Upload Time (Latest to Oldest)</option>
          <option value="confidence_asc">Confidence (Lowest to Highest)</option>
          <option value="confidence_desc">Confidence (Highest to Lowest)</option>
        </select>
      </div>

      {message}

      {loading || isLoading ? (
        <LoadingSpinner /> // Show loading spinner if loading
      ) : (
        <>
          {documents.length > 0 && (
            <>
              <ul className="document-list">
                {currentDocuments.map((doc) => (
                  <li key={doc.id} className="document-list-item">
                    <DocumentCard
                      document={doc} // Pass document object to DocumentCard
                      isExpanded={expandedDocumentId === doc.id} // Determine if the card is expanded
                      onToggle={handleToggle} // Pass the toggle function
                      onDelete={handleDelete} // Pass the delete function
                    />
                  </li>
                ))}
              </ul>
              <Pagination
                documentsPerPage={documentsPerPage} // Set number of documents per page
                totalDocuments={documents.length} // Set total number of documents
                paginate={paginate} // Pass pagination function
                currentPage={currentPage} // Set current page
              />
            </>
          )}
        </>
      )}
    </div>
  );
};