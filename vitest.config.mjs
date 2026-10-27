import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: [
        "test/*.ts"
    ],
    coverage: {
      provider: 'v8',
      include: [
        "src/playwright.ts",
        "src/pageObject.ts",
        "src/conditionWait.ts",
        "src/utils/utils.ts"
      ],
      // locator matchers in conditionWait.ts are covered by e2e tests
      thresholds: {
        branches: 90,
        functions: 70,
        lines: 85,
        statements: 85
      }
    },
    testTimeout: 20000
  }
})
