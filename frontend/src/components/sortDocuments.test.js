// frontend/src/components/sortDocuments.test.js

import { sortDocuments } from './sortDocuments';
import '@testing-library/jest-dom';

const mockDocuments = [
  { id: 1, filename: 'b.txt', predicted_category: 'B', confidence_scores: { 'B': 0.8 }, upload_time: '2023-10-02T12:00:00Z' },
  { id: 2, filename: 'a.txt', predicted_category: 'A', confidence_scores: { 'A': 0.9 }, upload_time: '2023-10-01T12:00:00Z' },
];

test('sorts documents by filename ascending', () => {
  const sorted = sortDocuments(mockDocuments, 'filename_asc');
  expect(sorted[0].filename).toBe('a.txt');
});

test('sorts documents by filename descending', () => {
  const sorted = sortDocuments(mockDocuments, 'filename_desc');
  expect(sorted[0].filename).toBe('b.txt');
});

test('sorts documents by upload time ascending', () => {
  const sorted = sortDocuments(mockDocuments, 'upload_time_asc');
  expect(sorted[0].filename).toBe('a.txt');
});

test('sorts documents by upload time descending', () => {
  const sorted = sortDocuments(mockDocuments, 'upload_time_desc');
  expect(sorted[0].filename).toBe('b.txt');
});

test('sorts documents by confidence ascending', () => {
  const sorted = sortDocuments(mockDocuments, 'confidence_asc');
  expect(sorted[0].filename).toBe('b.txt');
});

test('sorts documents by confidence descending', () => {
  const sorted = sortDocuments(mockDocuments, 'confidence_desc');
  expect(sorted[0].filename).toBe('a.txt');
});