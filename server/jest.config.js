/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  silent: false,
  forceExit: true,
  testTimeout: 10000,
  testMatch: ["**/apps/**/__tests__/*.test.ts", "**/core/tests/*.test.ts"],
};
