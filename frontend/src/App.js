// frontend/src/App.js

import React from "react";
import { Upload } from "./components/Upload";
import { DocumentList } from "./components/DocumentList";
import { DocumentProvider } from "./context/DocumentContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import "./styles/App.css";

function App() {
  return (
    <DocumentProvider>
      <div className="app-container">
        <Navbar />
        <div className="container">
          <h1>Smart Document Classifier</h1>
          <Upload />
          <DocumentList />
        </div>
        <Footer />
      </div>
    </DocumentProvider>
  );
}

export default App;