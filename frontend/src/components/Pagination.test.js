// frontend/src/components/Pagination.test.js

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Pagination } from './Pagination';
import '@testing-library/jest-dom';

test('renders Pagination component', () => {
  const { getAllByText } = render(
    <Pagination
      documentsPerPage={10}
      totalDocuments={100}
      paginate={() => {}}
      currentPage={1}
    />
  );

  // getAllByText returns an array, select the first occurrence
  const pageNumber = getAllByText(/^1$/i)[0];
  expect(pageNumber).toBeInTheDocument();
});


test('handles pagination click', () => {
  const paginate = jest.fn();
  const { getByText } = render(
    <Pagination
      documentsPerPage={10}
      totalDocuments={100}
      paginate={paginate}
      currentPage={1}
    />
  );
  const pageNumber = getByText(/2/i);
  fireEvent.click(pageNumber);
  expect(paginate).toHaveBeenCalledWith(2);
});