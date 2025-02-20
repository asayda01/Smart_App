// frontend/src/components/DocumentList.js

import React, { useEffect, useState, useRef } from "react";
import { useDocuments } from "../context/DocumentContext";
import { fetchDocuments } from "../services/api";
import { DocumentCard } from "./DocumentCard";
import { LoadingSpinner } from "./LoadingSpinner";
import { Pagination } from "./Pagination";
import { ErrorDisplay } from "./ErrorDisplay";
import "../styles/DocumentList.css";
import "../styles/Common.css";
import { sortDocuments } from "./sortDocuments";

export const DocumentList = () => {
  const { documents, setDocuments, error, setError, loading, removeDocument } = useDocuments();
  const [expandedDocumentId, setExpandedDocumentId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [documentsPerPage] = useState(9);
  const [sortOption, setSortOption] = useState("upload_time_desc"); /* default : Latest -> Oldest */
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchDocuments();
        setDocuments(data);
        setError(""); // Clear previous error
      } catch (err) {
        setError("Failed to fetch documents. Please check your network connection.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [setDocuments, setError]);

  const handleToggle = (docId) => {
    setExpandedDocumentId(expandedDocumentId === docId ? null : docId);
  };

      const handleDelete = async (docId) => {
        try {
          removeDocument(docId); // Remove from context state
        } catch (err) {
          setError("Failed to delete document. Please try again.");
        }
      };


  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const sortedDocuments = sortDocuments(documents, sortOption);

  const indexOfLastDocument = currentPage * documentsPerPage;
  const indexOfFirstDocument = indexOfLastDocument - documentsPerPage;
  const currentDocuments = sortedDocuments.slice(indexOfFirstDocument, indexOfLastDocument);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
        <LoadingSpinner />
      ) : (
        <>
          {documents.length > 0 && (
            <>
              <ul className="document-list">
                {currentDocuments.map((doc) => (
                  <li key={doc.id} className="document-list-item">
                    <DocumentCard
                      document={doc}
                      isExpanded={expandedDocumentId === doc.id}
                      onToggle={handleToggle}
                      onDelete={handleDelete}
                    />
                  </li>
                ))}
              </ul>
              <Pagination
                documentsPerPage={documentsPerPage}
                totalDocuments={documents.length}
                paginate={paginate}
                currentPage={currentPage}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};