import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: [
        "test/*.ts"
    ],
    coverage: {
      provider: 'v8',
      include: ["src/playwright.ts"],
      exclude: ["/lib/", "/node_modules/", "src/driverProvider.ts"],
      branches: 80,
      functions: 90,
      lines: 90,
      statements: -10,
    },
    testTimeout: 20000
  }
})
