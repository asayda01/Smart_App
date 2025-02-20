// frontend/src/components/Navbar.test.js

import React from 'react';
import { render } from '@testing-library/react';
import { Navbar } from './Navbar';
import '@testing-library/jest-dom';

test('renders Navbar component', () => {
  const { getByText } = render(<Navbar />);
  const homeLink = getByText(/Home/i);
  expect(homeLink).toBeInTheDocument();
});