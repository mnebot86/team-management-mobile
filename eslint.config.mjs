import js from '@eslint/js';
import globals from 'globals';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import stylistic from '@stylistic/eslint-plugin';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: [
      'node_modules/**',
      '.expo/**',
      'android/**',
      'ios/**',
      'dist/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat['jsx-runtime'],
  {
    files: ['**/*.{ts,tsx}'],
    settings: {
      react: { version: 'detect' },
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        Intl: 'readonly',
        ...globals.es2021,
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: {
      'react-hooks': pluginReactHooks,
      stylistic,
    },
    rules: {
      semi: ['error', 'always'],
      'object-curly-spacing': ['error', 'always'],
      'react/prop-types': 'off',
      'jsx-quotes': ['error', 'prefer-double'],
      quotes: ['error', 'single'],
      'no-mixed-spaces-and-tabs': 'error',
      indent: ['error', 2],
      'lines-between-class-members': ['error', 'always'],
      'react/jsx-closing-bracket-location': ['error', {
        selfClosing: 'line-aligned',
        nonEmpty: 'after-props',
      }],
      'react/jsx-curly-spacing': ['error', 'never'],
      'react/jsx-tag-spacing': ['error', { beforeClosing: 'never' }],
      'react/jsx-wrap-multilines': ['error', {
        declaration: 'parens-new-line',
        assignment: 'parens-new-line',
        return: 'parens-new-line',
        arrow: 'parens-new-line',
        condition: 'parens-new-line',
        logical: 'parens-new-line',
        prop: 'parens-new-line',
      }],
      'no-multiple-empty-lines': ['error', { max: 1 }],
      'no-multi-spaces': 'error',
      'no-nested-ternary': 'error',
      'key-spacing': ['error', { mode: 'strict' }],
      'comma-dangle': ['error', {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        functions: 'only-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
      }],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-trailing-spaces': 'error',
      'react-hooks/exhaustive-deps': 'error',
      'arrow-parens': ['error', 'as-needed'],
      'no-undef': 'error',
      'space-infix-ops': 'error',
      'react/jsx-equals-spacing': ['error', 'never'],
      'eol-last': ['error', 'always'],
      'comma-spacing': ['error', { before: false, after: true }],
      'keyword-spacing': ['error', { before: true, after: true }],
      'stylistic/padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: 'import', next: 'const' },
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'never', prev: 'import', next: 'import' },
        { blankLine: 'always', prev: '*', next: 'try' },
      ],
    },
  },
];