module.exports = {
  transform: {
    ".(ts|tsx)": "ts-jest",
  },
  testRegex: "(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$",
  moduleFileExtensions: ["ts", "tsx", "js"],
  testTimeout: 120000,
  globalSetup: "<rootDir>/src/scripts/globalSetup.ts",
  globalTeardown: "<rootDir>/src/scripts/globalTeardown.ts",
};
