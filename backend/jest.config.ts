import type { Config } from "jest"

const config: Config = {
  testEnvironment: "node",
  roots: ["<rootDir>/tests", "<rootDir>/src"],
  testPathIgnorePatterns: ["/node_modules/", "<rootDir>/tests/controleDeAcesso.test.ts"],
  setupFiles: ["<rootDir>/tests/setup-env.ts"],
  transform: { "^.+\\.ts$": ["ts-jest", { tsconfig: "tsconfig.test.json" }] },
  clearMocks: true,
  verbose: true,
  collectCoverageFrom: [
    "src/application/controllers/**/*.ts",
    "src/infrastructure/services/**/*.ts",
    "src/middleware/**/*.ts",
    "src/shared/**/*.ts",
  ],
}

export default config
