/** @type {import('jest').Config} */
export default {
  extensionsToTreatAsEsm: ['.ts'],
  testEnvironment: 'node',
  transform: {
    '^.+\.tsx?$': ['ts-jest', { useESM: true}],
  },
  moduleNameMapper: {
    '^(\.{1,2}/.*)\.js$': '$1',
  },
};
