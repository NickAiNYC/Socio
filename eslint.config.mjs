import js from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ['node_modules/**', 'website/assets/**', 'outputs/**', '.worktrees/**'] },
  js.configs.recommended,
  {
    files: ['**/*.mjs', '**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.node },
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
];
