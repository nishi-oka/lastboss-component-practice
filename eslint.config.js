/** @type {import('eslint').Linter.FlatConfig} */
const config = [
  {
    languageOptions: {
      globals: {
        browser: true,
        node: true,
      },
      parser: require('@typescript-eslint/parser'), // パーサーを直接インポートします
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      "react/react-in-jsx-scope": "off", // Next.jsでは不要
    },
  },
  {
    plugins: {
      react: require('eslint-plugin-react'),
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
      'jsx-a11y': require('eslint-plugin-jsx-a11y'),
      'import': require('eslint-plugin-import'),
    },
    rules: {
      "react/jsx-uses-react": "off", // ReactのJSX使用のためのルール
    },
  },
];

module.exports = config;
