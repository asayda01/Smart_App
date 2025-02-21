// frontend/src/App.js

import React from "react";
import { Upload } from "./components/Upload";
import { DocumentList } from "./components/DocumentList";
import { DocumentProvider } from "./context/DocumentContext"; // Import DocumentProvider for state management
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import "./styles/App.css"; // Import CSS styles for App component

function App() {
  return (
    <DocumentProvider> {/* Wrap the app with DocumentProvider for global state */}
      <div className="app-container"> {/* Main container for the app */}
        <Navbar /> {/* Render the Navbar component */}
        <div className="container"> {/* Container for main content */}
          <h1>Smart App &trade; Document Classifier</h1> {/* App title */}
          <Upload /> {/* Render the Upload component */}
          <p className="classifier-explanation">
            Let AI analyze and categorize your documents with precision and ease.
          </p> {/* Updated one-liner explanation */}
          <DocumentList /> {/* Render the DocumentList component */}
        </div>
        <Footer /> {/* Render the Footer component */}
      </div>
    </DocumentProvider>
  );
}

export default App;