// frontend/src/components/sortDocument.js

export const sortDocuments = (documents, sortOption) => {
  // Create a shallow copy of the documents array and sort it based on the sortOption
  return [...documents].sort((a, b) => {
    switch (sortOption) {
      // Sort by filename in ascending order
      case "filename_asc":
        return a.filename.localeCompare(b.filename);
      // Sort by filename in descending order
      case "filename_desc":
        return b.filename.localeCompare(a.filename);
      // Sort by predicted category in ascending order
      case "category":
        return a.predicted_category.localeCompare(b.predicted_category);
      // Sort by upload time in ascending order
      case "upload_time_asc":
        return new Date(a.upload_time) - new Date(b.upload_time);
      // Sort by upload time in descending order
      case "upload_time_desc":
        return new Date(b.upload_time) - new Date(a.upload_time);
      // Sort by confidence in ascending order
      case "confidence_asc":
        return (
          a.confidence_scores[a.predicted_category] - b.confidence_scores[b.predicted_category]
        );
      // Sort by confidence in descending order
      case "confidence_desc":
        return (
          b.confidence_scores[b.predicted_category] - a.confidence_scores[a.predicted_category]
        );
      // Default case returns 0, meaning no change in position
      default:
        return 0;
    }
  });
};
