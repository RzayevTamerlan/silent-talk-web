import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import prettier from 'eslint-plugin-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';

export default tseslint
  .config(
    { ignores: ['dist', 'vite.config.ts'] },

    {
      extends: [js.configs.recommended, ...tseslint.configs.recommended], // Добавляем конфигурацию Prettier
      files: ['**/*.{ts,tsx}'],
      languageOptions: {
        ecmaVersion: 2020,
        globals: globals.browser,
      },
      plugins: {
        'react-hooks': reactHooks,
        'react-refresh': reactRefresh,
        import: importPlugin,
        'simple-import-sort': simpleImportSort,
        prettier, // Добавляем плагин Prettier
      },
      rules: {
        ...reactHooks.configs.recommended.rules,
        'react-refresh/only-export-components': ['off'],
        '@typescript-eslint/no-unused-vars': [
          'warn',
          { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
        ],
        'simple-import-sort/imports': 'error',
        'simple-import-sort/exports': 'error',
        'prettier/prettier': 'error',
        'no-explicit-any': 'off',
        'no-undef': 'error', // Запрещает использование необъявленных переменных
        eqeqeq: ['error', 'always'], // Принудительное использование строгих сравнений
        'no-redeclare': 'error', // Запрещает повторное объявление переменных
        'no-shadow': 'error', // Запрещает тени переменных (переменные с одинаковыми именами в разных областях видимости)
        'no-trailing-spaces': 'error', // Запрещает пробелы в конце строки
        '@typescript-eslint/no-empty-object-type': 'off',
      },
    },
  )
  .concat(eslintPluginPrettier);
