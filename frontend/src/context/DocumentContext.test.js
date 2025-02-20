// frontend/src/context/DocumentContext.test.js

import React from 'react';
import { render, screen,fireEvent } from '@testing-library/react';
import { DocumentProvider, useDocuments } from './DocumentContext';
import '@testing-library/jest-dom';

const TestComponent = () => {
  const { documents, setDocuments } = useDocuments();
  return (
    <div>
      <span>{documents.length}</span>
      <button onClick={() => setDocuments([{ id: 1, filename: 'test.txt' }])}>Set Documents</button>
    </div>
  );
};

test('DocumentContext provides documents and setDocuments', () => {
  render(
    <DocumentProvider>
      <TestComponent />
    </DocumentProvider>
  );

  const documentCount = screen.getByText('0');
  expect(documentCount).toBeInTheDocument();

  const setDocumentsButton = screen.getByText('Set Documents');
  fireEvent.click(setDocumentsButton);

  const updatedDocumentCount = screen.getByText('1');
  expect(updatedDocumentCount).toBeInTheDocument();
});