module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['./test/setEnv.ts'],
  testPathIgnorePatterns: ['/dist/'],
}
