import css from '@eslint/css';
import js from '@eslint/js';
import json from '@eslint/json';
import markdown from '@eslint/markdown';
import pluginReact from 'eslint-plugin-react';
import { defineConfig } from 'eslint-define-config';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default defineConfig([
  // JavaScript and TypeScript source files (only in src/)
  {
    files: [
      'apps/*/src/**/*.{js,mjs,cjs,ts,tsx}',
      'packages/*/src/**/*.{js,mjs,cjs,ts,tsx}',
    ],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: [
          './apps/backend/tsconfig.json',
          './apps/client/tsconfig.json',
          './apps/storage/tsconfig.json',
          './packages/common/tsconfig.json',
        ],
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      prettier,
      react: pluginReact,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...pluginReact.configs.flat.recommended.rules,
      ...prettierConfig.rules,
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-empty-object-type': 'off', // Disabled until user.ts is fixed
      '@typescript-eslint/no-require-imports': 'off', // Allow require() for vite.config.ts
    },
  },
  // JavaScript configuration files (no TypeScript type-checking)
  {
    files: ['**/*.{js,mjs,cjs}', '!apps/*/src/**/*', '!packages/*/src/**/*'],
    languageOptions: {
      parser: js.parser,
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      prettier,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...prettierConfig.rules,
      'prettier/prettier': 'error',
    },
  },
  // JSON files
  {
    files: ['**/*.json', '**/*.jsonc', '**/*.json5'],
    languageOptions: {
      parser: json.language,
    },
    plugins: { json },
    rules: {
      ...json.configs.recommended.rules,
      '@typescript-eslint/no-unused-expressions': 'off', // Explicitly disable TypeScript rule
      '@typescript-eslint/no-unused-vars': 'off', // Disable other TypeScript rules
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  // Markdown files
  {
    files: ['**/*.md'],
    languageOptions: { parser: markdown.language },
    plugins: { markdown },
    rules: markdown.configs.recommended.rules,
  },
  // CSS files
  {
    files: ['**/*.css'],
    languageOptions: { parser: css.language },
    plugins: { css },
    rules: css.configs.recommended.rules,
  },
  // Global ignores
  {
    ignores: [
      'coverage/**',
      '**/public/**',
      '**/dist/**',
      'pnpm-lock.yaml',
      'pnpm-workspace.yaml',
      '**/node_modules/**',
      '**/.vscode/**',
      '**/package-lock.json',
      '**/.eslintrc.*',
      '**/.prettierrc.*',
      '**/jest.config.*',
      '**/vite.config.*',
      '**/commitlint.config.*',
      '**/package.json', // Explicitly ignore package.json
      '**/tsconfig.json', // Explicitly ignore tsconfig.json
    ],
  },
]);
