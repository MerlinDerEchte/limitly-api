import js from '@eslint/js';
import globals from 'globals';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Notes:
 * - Assumes TypeScript project files are in ./tsconfig.json (default NestJS setup).
 * - If your Nest app is ESM, keep sourceType: 'module'. If you're compiling to CJS, change to 'commonjs'.
 * - Node 22 has full modern syntax, so we use ecmaVersion: 'latest'.
 */

const tsRecommendedTC =
  tsPlugin.configs['recommended-type-checked'] ??
  tsPlugin.configs.recommendedTypeChecked;

export default [
  // 1) Ignore build artifacts
  {
    ignores: ['dist', 'node_modules', 'coverage'],
  },

  // 2) Base JS recommendations
  js.configs.recommended,

  // 3) TypeScript rules (type-aware)
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        // Type-aware rules use your TS project
        projectService: true,
        tsconfigRootDir: __dirname,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.jest, // Node APIs
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      // Start from @typescript-eslint recommended (type-checked)
      ...(tsRecommendedTC?.rules ?? {}),

      // Reasonable Nest/TS defaults
      '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports' }],
      '@typescript-eslint/no-explicit-any': 'off', // loosen for DTOs/guards as needed
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-misused-promises': ['warn', { checksVoidReturn: { attributes: false } }],
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },

  // 4) Tests: allow Jest globals & relax a bit
  {
    files: ['**/*.spec.ts', '**/*.test.ts'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      // Tests often use any/mocks
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      'no-console': 'off',
    },
  },

  // 5) Prettier integration (shows formatting issues in ESLint)
  prettierRecommended,
];