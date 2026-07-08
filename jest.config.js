module.exports = {
  preset: 'react-native',
  collectCoverageFrom: ['src/coverage/**/*.{ts,tsx}'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
};
