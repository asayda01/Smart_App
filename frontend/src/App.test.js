// frontend/src/App.test.js

import React from "react";
import App from "./App";
import axios from "axios";
import '@testing-library/jest-dom';
import { render, screen, waitFor } from "@testing-library/react";

jest.mock("axios");

test("renders upload dropzone", async () => {
  // Mock the axios GET request
  axios.get.mockResolvedValueOnce({ data: [] }); // Mock an empty response

  render(<App />);

  // Wait for the dropzone to be in the document
  const dropzone = await waitFor(() => screen.getByText(/Drag & drop or click to upload a file/i));

  expect(dropzone).toBeInTheDocument();
});
