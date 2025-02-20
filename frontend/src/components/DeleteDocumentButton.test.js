// frontend/src/components/deleteDocumentButton.test.js

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import DeleteDocumentButton from './deleteDocumentButton';
import '@testing-library/jest-dom';

test('renders DeleteDocumentButton component', () => {
  const { getByText } = render(<DeleteDocumentButton docId={1} fileName="test.txt" onDelete={() => {}} />);
  const deleteButton = getByText(/Delete This Document/i);
  expect(deleteButton).toBeInTheDocument();
});

test('handles delete button click', () => {

  global.window.confirm = jest.fn(() => true);

  const onDelete = jest.fn();
  const { getByText } = render(<DeleteDocumentButton docId={1} fileName="test.txt" onDelete={onDelete} />);
  const deleteButton = getByText(/Delete This Document/i);

  fireEvent.click(deleteButton);

  expect(window.confirm).toHaveBeenCalledWith('Do you want to delete "test.txt"?');
});

