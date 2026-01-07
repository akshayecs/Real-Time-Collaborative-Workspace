process.env.NODE_ENV = "test";

/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  maxWorkers: 1,
  rootDir: ".",
  testMatch: ["<rootDir>/tests/**/*.spec.ts"],
  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
  modulePathIgnorePatterns: ["<rootDir>/dist"],
  transform: {
    "^.+\\.ts$": ["ts-jest", { tsconfig: "tsconfig.json" }],
  },
  moduleNameMapper: {
    "^.+/start.kafka$": "<rootDir>/tests/__mocks__/kafka.start.ts",
  },
  clearMocks: true,
};
