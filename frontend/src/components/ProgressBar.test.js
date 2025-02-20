// frontend/src/components/ProgressBar.test.js

import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProgressBar } from './ProgressBar';

test('renders ProgressBar component', () => {
  const { getByText } = render(<ProgressBar progress={50} />);
  const progressText = getByText(/50%/i);
  expect(progressText).toBeInTheDocument();
});
