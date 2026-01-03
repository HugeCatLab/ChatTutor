import { defineConfig } from 'vitest/config'
import dotenv from 'dotenv'

dotenv.config()

export default defineConfig({
  test: {
    globals: true,
    include: [
      'packages/**/*.test.ts',
    ],
    env: process.env,
    testTimeout: Infinity,
  },
})