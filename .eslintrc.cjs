/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  extends: [
    'eslint:recommended',
    // 'plugin:vue/vue3-essential',
    // "plugin:vue/vue3-recommended",
    // '@vue/eslint-config-prettier/skip-formatting',
    // '@vue/eslint-config-typescript',
    // '@vue/eslint-config-typescript/recommended',
    '@vue/typescript/recommended'
    // '@vue/eslint-config-prettier'

    // '@vue/prettier',
    // '@vue/prettier/@typescript-eslint',
    // 'prettier',
    // 'plugin:prettier/recommended'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  overrides: [
    {
      files: ['cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx,vue,json,html,md,svg,css,scss,yaml,yml}'],
      extends: ['plugin:cypress/recommended']
    }
  ],
  rules: {
    // 'prettier/prettier': 'error',
    // 'comma-dangle': ['error', 'never'],
    // 'vue/multi-word-component-names': 0,
    semi: ['error', 'never'],
    // 'eol-last': ['error', 'always']

  },
  parserOptions: {
    ecmaVersion: 'latest'
  }
}
