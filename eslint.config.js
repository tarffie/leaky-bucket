import { defineConfig } from 'eslint-define-config';
import tseslint from 'typescript-eslint';
import path from 'path';

export default defineConfig([
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/*.json',
      '**/*.config.js',
      '!eslint.config.js'
    ]
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: [
          path.resolve('apps/server/tsconfig.json'),
          path.resolve('packages/common/tsconfig.json')
        ],
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' }
      ]
    }
  }
]);
