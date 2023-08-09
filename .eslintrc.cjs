/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  overrides: [
    {
      files: [
        'cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx,vue,json,html,md,svg,css,scss,yaml,yml}'
      ],
      'extends': [
        'plugin:cypress/recommended'
      ]
    }
  ],
  rules: {
    'comma-dangle': ["error", "never"],
    'vue/multi-word-component-names': 0,
    'semi': ["error", "never"],
    'eol-last': ["error", "always"]
  },
  parserOptions: {
    ecmaVersion: 'latest'
  }
}
