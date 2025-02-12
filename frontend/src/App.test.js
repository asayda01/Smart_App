// frontend/src/App.test.js

import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

test("renders upload dropzone", () => {
  render(<App />);
  const dropzone = screen.getByText(/Drag & drop a .txt file here/i);
  expect(dropzone).toBeInTheDocument();
});