/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  silent: false,
  forceExit: true,
  testMatch: ["**/apps/**/__tests__/*.test.ts", "**/core/tests/*.test.ts"],
};
