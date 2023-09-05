import {defaults as tsjPreset} from 'ts-jest/presets';
import type {JestConfigWithTsJest} from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  ...tsjPreset,
  preset: '@testing-library/react-native',
  transform: {
    '^.+\\.jsx$': 'babel-jest',
    '^.+\\.tsx$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.spec.json',
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|react-native|react-native-code-push|@react-navigation|uuid)/)',
  ],
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',
    '<rootDir>/__tests__/jest-setup.ts',
  ],
  moduleNameMapper: {
    '^app/(.*)$': '<rootDir>/src/$1',
    '^typeorm$': '<rootDir>/node_modules/typeorm',
  },
  testMatch: ['**/?(*.)test.(ts|tsx)'],
};

export default jestConfig;
