// frontend/src/components/DocumentCard.js

import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { getConfidenceColor, getConfidenceLevel } from "./confidenceUtils";
import { motion, AnimatePresence } from "framer-motion";
import DeleteDocumentButton from "./DeleteDocumentButton";
import "../styles/DocumentCard.css";

export const DocumentCard = React.memo(({ document, isExpanded, onToggle, onDelete }) => {
  const handleToggle = useCallback(() => {
    onToggle(document.id);
  }, [onToggle, document.id]);

  const confidenceValue = document.confidence_scores[document.predicted_category] * 100;
  const confidenceColor = getConfidenceColor(confidenceValue);
  const confidenceLevel = getConfidenceLevel(confidenceValue);

  const fileExtension = document.filename.split(".").pop();
  const truncatedFilename =
    document.filename.length > 45
      ? document.filename.substring(0, 30) + `... .${fileExtension}`
      : document.filename;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="document-card">
        <div className="document-header">
          <div className="document-info">
            <h4>{truncatedFilename}</h4>
            <span>
              <strong>Category:</strong> {document.predicted_category}
            </span>
            <span>
              <strong>Confidence Value:</strong>{" "}
              <span style={{ color: confidenceColor }}>{confidenceValue.toFixed(2)}%</span>
            </span>
            <span>
              <strong>Confidence Level:</strong>{" "}
              <span style={{ color: confidenceColor }}>{confidenceLevel}</span>
            </span>
          </div>

          <div className="document-actions">
            <span className="upload-time">{new Date(document.upload_time).toLocaleString()}</span>
            <DeleteDocumentButton docId={document.id} fileName={document.filename} onDelete={onDelete} />
          </div>
        </div>

        <button className="toggle-confidence" onClick={handleToggle}>
          {isExpanded ? "Hide Confidence Scores" : "Show Confidence Scores"}
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="confidence-scores"
            >
              <ul>
                {Object.entries(document.confidence_scores).map(([category, confidence]) => {
                  const confidencePercentage = confidence * 100;
                  const color = getConfidenceColor(confidencePercentage);
                  const level = getConfidenceLevel(confidencePercentage);
                  return (
                    <li key={category} className="confidence-grid">
                      <span>{category}:</span>
                      <span style={{ color }}>{confidencePercentage.toFixed(2)}%</span>
                      <span>Confidence Level:</span>
                      <span style={{ color }}>{level}</span>
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

DocumentCard.propTypes = {
  document: PropTypes.object.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};