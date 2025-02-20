// frontend/src/components/DocumentCard.test.js

import React from 'react';
import { render } from '@testing-library/react';
import { DocumentCard } from './DocumentCard';
import '@testing-library/jest-dom';

const mockDocument = {
  id: 1,
  filename: 'test.txt',
  predicted_category: 'Test Category',
  confidence_scores: { 'Test Category': 0.95 },
  upload_time: '2023-10-01T12:00:00Z',
};

test('renders DocumentCard component', () => {
  const { getByText } = render(
    <DocumentCard
      document={mockDocument}
      isExpanded={false}
      onToggle={() => {}}
      onDelete={() => {}}
    />
  );
  const filenameElement = getByText(/test.txt/i);
  expect(filenameElement).toBeInTheDocument();
});