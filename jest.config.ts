import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'jest-css-modules-transform',
    '^@components(.*)$': '<rootDir>/src/components$1',
    '^@ui(.*)$': '<rootDir>/src/components/ui$1',
    '^@utils-types$': '<rootDir>/src/utils/types',
    '^@pages(.*)$': '<rootDir>/src/pages$1'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@zlden/react-developer-burger-ui-components)/)'
  ],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8'
};

export default config;
