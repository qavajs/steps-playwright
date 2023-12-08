import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      include: ["src/browserManager.ts"],
      exclude: ["/lib/", "/node_modules/", "src/driverProvider.ts"],
      branches: 80,
      functions: 90,
      lines: 90,
      statements: -10,
    },
    testTimeout: 20000
  }
})
