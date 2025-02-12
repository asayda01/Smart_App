// frontend/src/components/sortDocument.js

export const sortDocuments = (documents, sortOption) => {
  return [...documents].sort((a, b) => {
    switch (sortOption) {
      case "filename_asc":
        return a.filename.localeCompare(b.filename);
      case "filename_desc":
        return b.filename.localeCompare(a.filename);
      case "category":
        return a.predicted_category.localeCompare(b.predicted_category);
      case "upload_time_asc":
        return new Date(a.upload_time) - new Date(b.upload_time);
      case "upload_time_desc":
        return new Date(b.upload_time) - new Date(a.upload_time);
      case "confidence_asc":
        return (
          a.confidence_scores[a.predicted_category] - b.confidence_scores[b.predicted_category]
        );
      case "confidence_desc":
        return (
          b.confidence_scores[b.predicted_category] - a.confidence_scores[a.predicted_category]
        );
      default:
        return 0;
    }
  });
};
