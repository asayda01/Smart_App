// frontend/utils/confidenceUtils.js
export const getConfidenceColor = (confidence) => {
  if (confidence === 100) return "blue";
  if (confidence >= 75.0) return "green";
  if (confidence >= 50.0) return "gold";
  if (confidence >= 25.0) return "red";
  return "black";
};

export const getConfidenceLevel = (confidence) => {
  if (confidence === 100) return "N/A";
  if (confidence >= 75.0) return "HIGH";
  if (confidence >= 50.0) return "MEDIUM";
  if (confidence >= 25.0) return "LOW";
  return "N/A";
};