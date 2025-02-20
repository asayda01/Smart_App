// frontend/src/components/Pagination.js

import React from "react";
import "../styles/Pagination.css"; // Import CSS styles for pagination

// Define the Pagination component that takes props for pagination settings
export const Pagination = ({ documentsPerPage, totalDocuments, paginate, currentPage }) => {
  const pageNumbers = []; // Initialize an array to hold the page numbers

  // Calculate total number of pages and populate pageNumbers array
  for (let i = 1; i <= Math.ceil(totalDocuments / documentsPerPage); i++) {
    pageNumbers.push(i); // Add each page number to the array
  }

  return (
    <nav> {/* Wrap pagination in a <nav> element for semantic HTML */}
      <ul className="pagination"> {/* Create an unordered list for page numbers */}
        {pageNumbers.map((number) => ( // Iterate over each page number
          <li key={number} className="page-item"> {/* Each page number is a list item */}
            <button
              onClick={() => paginate(number)} // Call paginate function with the selected page number on click
              className={`page-link ${currentPage === number ? "active" : ""}`} // Add "active" class to current page
            >
              {number} {/* Display the page number */}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};
