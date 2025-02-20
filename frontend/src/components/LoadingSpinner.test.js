// frontend/src/components/LoadingSpinner.test.js

import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LoadingSpinner } from './LoadingSpinner';

test('renders LoadingSpinner component', () => {
  const { container } = render(<LoadingSpinner />);
  const spinner = container.querySelector('.MuiCircularProgress-root');
  expect(spinner).toBeInTheDocument();
});