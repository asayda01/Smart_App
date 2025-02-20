// frontend/src/components/DocumentCard.js

import React, { useCallback } from "react";
import PropTypes from "prop-types"; // Import PropTypes for type checking
import { getConfidenceColor, getConfidenceLevel } from "./confidenceUtils"; // Import confidence utilities
import { motion, AnimatePresence } from "framer-motion"; // Import animations
import DeleteDocumentButton from "./DeleteDocumentButton"; // Import DeleteDocumentButton
import "../styles/DocumentCard.css"; // Import CSS styles

export const DocumentCard = React.memo(({ document, isExpanded, onToggle, onDelete }) => { // Memoized DocumentCard component
  const handleToggle = useCallback(() => { // Function to toggle document expansion
    onToggle(document.id);
  }, [onToggle, document.id]);

  const confidenceValue = document.confidence_scores[document.predicted_category] * 100; // Calculate confidence value
  const confidenceColor = getConfidenceColor(confidenceValue); // Get confidence color
  const confidenceLevel = getConfidenceLevel(confidenceValue); // Get confidence level

  const fileExtension = document.filename.split(".").pop(); // Get file extension
  const truncatedFilename = document.filename.length > 45 // Truncate filename if too long
    ? document.filename.substring(0, 30) + `... .${fileExtension}`
    : document.filename;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}> {/* Animation for card */}
      <div className="document-card"> {/* Document card container */}
        <div className="document-header"> {/* Header section */}
          <div className="document-info"> {/* Document info */}
            <h4>{truncatedFilename}</h4> {/* Display truncated filename */}
            <span><strong>Category:</strong> {document.predicted_category}</span> {/* Display category */}
            <span><strong>Confidence Value:</strong> <span style={{ color: confidenceColor }}>{confidenceValue.toFixed(2)}%</span></span> {/* Display confidence value */}
            <span><strong>Confidence Level:</strong> <span style={{ color: confidenceColor }}>{confidenceLevel}</span></span> {/* Display confidence level */}
          </div>
          <div className="document-actions"> {/* Actions section */}
            <span className="upload-time">{new Date(document.upload_time).toLocaleString()}</span> {/* Display upload time */}
            <DeleteDocumentButton docId={document.id} fileName={document.filename} onDelete={onDelete} /> {/* Delete button */}
          </div>
        </div>
        <button className="toggle-confidence" onClick={handleToggle}> {/* Toggle button */}
          {isExpanded ? "Hide Confidence Scores" : "Show Confidence Scores"}
        </button>
        <AnimatePresence> {/* Animation for expanded content */}
          {isExpanded && ( // Show confidence scores if expanded
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="confidence-scores"> {/* Animation for scores */}
              <ul> {/* List of confidence scores */}
                {Object.entries(document.confidence_scores).map(([category, confidence]) => { // Map through confidence scores
                  const confidencePercentage = confidence * 100; // Calculate percentage
                  const color = getConfidenceColor(confidencePercentage); // Get color
                  const level = getConfidenceLevel(confidencePercentage); // Get level
                  return (
                    <li key={category} className="confidence-grid"> {/* Confidence score item */}
                      <span>{category}:</span> {/* Category name */}
                      <span style={{ color }}>{confidencePercentage.toFixed(2)}%</span> {/* Confidence percentage */}
                      <span>Confidence Level:</span> {/* Confidence level label */}
                      <span style={{ color }}>{level}</span> {/* Confidence level */}
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});

DocumentCard.propTypes = { // Prop type validation
  document: PropTypes.object.isRequired, // Document object
  isExpanded: PropTypes.bool.isRequired, // Expanded state
  onToggle: PropTypes.func.isRequired, // Toggle function
  onDelete: PropTypes.func.isRequired, // Delete function
};