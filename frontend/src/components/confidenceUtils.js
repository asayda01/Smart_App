// frontend/utils/confidenceUtils.js

export const getConfidenceColor = (confidence) => { // Get color based on confidence value
  if (confidence === 100) return "blue"; // Blue for 100% confidence
  if (confidence >= 75.0) return "green"; // Green for >= 75%
  if (confidence >= 50.0) return "gold"; // Gold for >= 50%
  if (confidence >= 25.0) return "red"; // Red for >= 25%
  return "black"; // Black for others
};

export const getConfidenceLevel = (confidence) => { // Get confidence level as text
  if (confidence === 100) return "N/A"; // N/A for 100%
  if (confidence >= 75.0) return "HIGH"; // HIGH for >= 75%
  if (confidence >= 50.0) return "MEDIUM"; // MEDIUM for >= 50%
  if (confidence >= 25.0) return "LOW"; // LOW for >= 25%
  return "N/A"; // N/A for others
};