import { defineConfig } from 'vitest/config'
import path from 'path'
import { fileURLToPath } from 'node:url'
import { defineVitestConfig } from '@nuxt/test-utils/config'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig(
  defineVitestConfig({
    test: {
      globals: true,
      environment: 'node',
      include: ['test/**/*.{test,spec}.ts'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        include: ['server/**/*.ts'],
        exclude: [
          'node_modules/',
          'test/',
          '.nuxt/',
          'dist/',
          'server/plugins/',
        ],
      },
    },
    resolve: {
      alias: {
        '@@': path.resolve(__dirname, './'),
        '#app': path.resolve(__dirname, './node_modules/nuxt/dist/app'),
        '~': path.resolve(__dirname, './'),
      },
    },
  })
)
