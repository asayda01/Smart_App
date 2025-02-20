// frontend/src/components/Footer.test.js

import React from 'react';
import { render } from '@testing-library/react';
import { Footer } from './Footer';
import '@testing-library/jest-dom';

test('renders Footer component', () => {
  const { getByText } = render(<Footer />);
  const addressLink = getByText(/195 Bancroft Road, London, E14ET/i);
  expect(addressLink).toBeInTheDocument();
});