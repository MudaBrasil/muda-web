import { defineConfig } from 'cypress'
// const { defineConfig } = require('cypress')

// module.exports = defineConfig({
export default defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
    baseUrl: 'http://localhost:4173'
  }
})
