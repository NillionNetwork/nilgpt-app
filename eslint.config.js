// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const tanstackQueryPlugin = require('@tanstack/eslint-plugin-query');
const prettierPlugin = require('eslint-plugin-prettier');
const eslintConfigPrettier = require('eslint-config-prettier/flat');

module.exports = defineConfig([
  expoConfig,
  eslintConfigPrettier,
  {
    plugins: {
      '@tanstack/query': tanstackQueryPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...tanstackQueryPlugin.configs.recommended.rules,
      ...prettierPlugin.configs.recommended.rules,
    },
  },
  {
    ignores: ['dist/*'],
  },
]);
