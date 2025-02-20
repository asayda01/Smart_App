// frontend/src/components/LoadingModal.test.js

import React from 'react';
import { render } from '@testing-library/react';
import { LoadingModal } from './LoadingModal';
import '@testing-library/jest-dom';

test('renders LoadingModal component', () => {
  const { getByText } = render(<LoadingModal message="Loading..." />);
  const loadingMessage = getByText(/Loading.../i);
  expect(loadingMessage).toBeInTheDocument();
});