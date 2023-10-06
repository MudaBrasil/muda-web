/// <reference types="vitest" />
import viteConfig from './vite.config'
import { defineConfig, mergeConfig, configDefaults } from 'vitest/config'
import { fileURLToPath } from 'node:url'

export default mergeConfig(
  viteConfig({ mode: 'test' }),
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/*'],
      root: fileURLToPath(new URL('./'))
    }
  })
)
