import nextJest from "next/jest.js"

// next/jest usa o compilador do próprio Next (SWC) para ler TypeScript, então não precisa de ts-jest.
// O arquivo é .mjs, como o eslint.config.mjs: um jest.config.ts exigiria instalar o ts-node.
const createJestConfig = nextJest({ dir: "./" })

/** @type {import("jest").Config} */
const config = {
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  setupFiles: ["<rootDir>/tests/setup-env.ts"],
  moduleNameMapper: { "^@/(.*)$": "<rootDir>/src/$1" },
  clearMocks: true,
  verbose: true,
  collectCoverageFrom: ["src/store/cartStore.ts", "src/utils/**/*.ts"],
}

export default createJestConfig(config)
