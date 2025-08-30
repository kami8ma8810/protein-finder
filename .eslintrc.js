/**
 * ESLint Configuration
 */
module.exports = {
  root: true,
  extends: [
    'expo',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier', // prettierとの競合を防ぐため最後に配置
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2022,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'react-native'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  env: {
    'react-native/react-native': true,
    jest: true,
  },
  rules: {
    // TypeScript厳格ルール
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/explicit-function-return-type': [
      'warn',
      {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
      },
    ],
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-misused-promises': 'error',
    '@typescript-eslint/strict-boolean-expressions': 'off',

    // React/React Native
    'react/prop-types': 'off' /* TypeScriptで型定義するため不要 */,
    'react/react-in-jsx-scope': 'off' /* React 17+では不要 */,
    'react-native/no-unused-styles': 'warn',
    'react-native/no-inline-styles': 'warn',
    'react-native/no-single-element-style-arrays': 'warn',

    // React Hooks
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // 一般的なベストプラクティス
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-template': 'error',

    // アクセシビリティ
    'jsx-a11y/accessible-emoji': 'off',
    'jsx-a11y/alt-text': 'off',
  },
  overrides: [
    {
      // テストファイルは一部ルールを緩和
      files: ['**/__tests__/**/*', '**/*.test.ts', '**/*.test.tsx'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
      },
    },
  ],
};
