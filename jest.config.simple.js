// Simple Jest configuration for domain model testing
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@core/(.*)$': '<rootDir>/src/core/$1',
    '^@domain/(.*)$': '<rootDir>/src/core/domain/$1',
    '^expo-sqlite$': '<rootDir>/src/infrastructure/database/__mocks__/expo-sqlite.ts',
  },
};