/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
module.exports = {
  testPathIgnorePatterns: ['/__tests__/'],
  watchPathIgnorePatterns: ['/dist/'],
  clearMocks: true,
  collectCoverage: false,
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
};
