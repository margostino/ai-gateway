module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // setupFiles: ['dotenv/config'],
  setupFiles: ['./jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
