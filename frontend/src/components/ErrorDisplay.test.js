// frontend/src/components/ErrorDisplay.test.js

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { ErrorDisplay } from './ErrorDisplay';
import '@testing-library/jest-dom';

test('renders ErrorDisplay component', () => {
  const { getByText } = render(<ErrorDisplay error="Test Error" />);
  const errorText = getByText(/Test Error/i);
  expect(errorText).toBeInTheDocument();
});

test('handles dismiss button click', () => {
  const onDismiss = jest.fn();
  const { getByText } = render(<ErrorDisplay error="Test Error" onDismiss={onDismiss} />);
  const dismissButton = getByText(/X/i);
  fireEvent.click(dismissButton);
  expect(onDismiss).toHaveBeenCalled();
});