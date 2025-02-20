// frontend/src/components/DocumentList.test.js

import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { DocumentList } from './DocumentList';
import { DocumentProvider } from '../context/DocumentContext';

const mockDocuments = [
  {
    id: 1,
    filename: 'test1.txt',
    predicted_category: 'Test Category 1',
    confidence_scores: { 'Test Category 1': 0.95 },
    upload_time: '2023-10-01T12:00:00Z',
  },
  {
    id: 2,
    filename: 'test2.txt',
    predicted_category: 'Test Category 2',
    confidence_scores: { 'Test Category 2': 0.85 },
    upload_time: '2023-10-02T12:00:00Z',
  },
];

test('renders DocumentList component', () => {
  render(
    <DocumentProvider>
      <DocumentList />
    </DocumentProvider>
  );
  const loadingMessage = screen.getByText(/Loading Please Wait/i);
  expect(loadingMessage).toBeInTheDocument();
});