/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
	root: true,
	env: {
		browser: true,
		es2021: true,
		node: true
	},
	extends: ['eslint:recommended', '@vue/typescript/recommended'],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	overrides: [
		{
			files: ['cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx,vue,json,html,md,svg,css,scss,yaml,yml}'],
			extends: ['plugin:cypress/recommended']
		}
	],
	rules: {
		'@typescript-eslint/no-explicit-any': 'off',
		semi: ['error', 'never']
	},
	parserOptions: {
		ecmaVersion: 'latest'
	}
}
