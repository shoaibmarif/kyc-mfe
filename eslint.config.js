const js = require('@eslint/js');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const globals = require('globals');

module.exports = [
    {
        ignores: ['node_modules/**', 'dist/**', 'build/**', 'webpack.config.js', '*.config.js'],
    },
    {
        files: ['src/**/*.{js,jsx,ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: 'module',
            parser: tsParser,
            globals: {
                ...globals.browser,
                ...globals.es2021,
                ...globals.node,
                React: 'readonly',
                RequestInit: 'readonly',
                NodeJS: 'readonly',
                __webpack_init_sharing__: 'readonly',
                __webpack_share_scopes__: 'readonly',
            },
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
        },
        rules: {
            ...js.configs.recommended.rules,
            ...tsPlugin.configs.recommended.rules,

            // TypeScript - Strict Code Quality
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],
            '@typescript-eslint/no-explicit-any': 'off', // Common in mock services and generic APIs
            '@typescript-eslint/prefer-optional-chain': 'off', // Requires type information
            '@typescript-eslint/prefer-nullish-coalescing': 'off', // Requires type information
            '@typescript-eslint/no-non-null-assertion': 'off', // Used in type guards
            '@typescript-eslint/require-await': 'off', // Mock services may be async without await
            '@typescript-eslint/no-floating-promises': 'off',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',

            // JavaScript Best Practices
            'no-console': 'off', // Allow console during development, but pre-commit hook will catch them
            'no-debugger': 'error',
            'no-alert': 'warn',
            'no-var': 'error',
            'prefer-const': 'warn',
            'prefer-template': 'warn',
            eqeqeq: ['error', 'always', { null: 'ignore' }],
            'no-eval': 'error',
            'no-implied-eval': 'error',

            // Code Quality
            'no-duplicate-imports': 'error',
            'no-return-await': 'warn',
            'no-unsafe-optional-chaining': 'error',
            'no-promise-executor-return': 'error',

            // React/JSX
            'no-undef': 'off',
        },
    },
];
