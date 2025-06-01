/** @type {import('jest').Config} */
module.exports = {
  // Use ts-jest for TypeScript support
  preset: 'ts-jest',

  // Test environment (Node.js for a storage service)
  testEnvironment: 'node',

  // File patterns to include
  testMatch: ['<rootDir>/src/**/*.(test|spec).ts'],

  // Module resolution for TypeScript paths
  moduleNameMapper: {
    '^@woovi/common/(.*)$': '<rootDir>/../common/src/$1',
  },

  // Coverage settings
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  coverageReporters: ['text', 'html', 'json'],

  // Root directory
  rootDir: '.',

  // Transform TypeScript files
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
};
