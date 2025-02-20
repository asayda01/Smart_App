// frontend/src/components/confidenceUtils.test.js

import { getConfidenceColor, getConfidenceLevel } from './confidenceUtils';
import '@testing-library/jest-dom';

test('getConfidenceColor returns correct color for confidence levels', () => {
  expect(getConfidenceColor(100)).toBe('blue');
  expect(getConfidenceColor(80)).toBe('green');
  expect(getConfidenceColor(60)).toBe('gold');
  expect(getConfidenceColor(40)).toBe('red');
  expect(getConfidenceColor(10)).toBe('black');
});

test('getConfidenceLevel returns correct level for confidence levels', () => {
  expect(getConfidenceLevel(100)).toBe('N/A');
  expect(getConfidenceLevel(80)).toBe('HIGH');
  expect(getConfidenceLevel(60)).toBe('MEDIUM');
  expect(getConfidenceLevel(40)).toBe('LOW');
  expect(getConfidenceLevel(10)).toBe('N/A');
});