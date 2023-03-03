/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  forceExit: true,
  silent: false,
  testMatch: ["**/apps/**/tests/*.test.ts", "**/core/tests/*.test.ts"],
};
