// apps/server/eslint.config.js
import { defineConfig } from 'eslint-define-config'
import tseslint from 'typescript-eslint'

export default defineConfig({
  files: ['**/*.ts'],
  ignores: [
    '**/node_modules',
    '**/dist',
    '**/*.json',
    '**/*.config.js',
    '**/.gitignore' 
  ],
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      project: true
    }
  }
})
