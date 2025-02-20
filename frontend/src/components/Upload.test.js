// frontend/src/components/Upload.test.js

import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Upload } from "./Upload";
import { DocumentProvider } from "../context/DocumentContext";
import { uploadFile } from "../services/api";

// Mock the uploadFile function
jest.mock("../services/api", () => ({
  uploadFile: jest.fn().mockImplementation(async (file, onUploadProgress) => {
    for (let i = 0; i <= 100; i += 20) {
      onUploadProgress({ loaded: i, total: 100 });
      await new Promise((resolve) => setTimeout(resolve, 50)); // Simulate upload delay
    }
    return { id: "123", name: file.name }; // Mock successful response
  }),
}));

test("renders Upload component", () => {
  const { getByText } = render(
    <DocumentProvider>
      <Upload />
    </DocumentProvider>
  );

  expect(getByText(/Drag & drop or click to upload a file/i)).toBeInTheDocument();
});
