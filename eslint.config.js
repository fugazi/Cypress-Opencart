// @ts-check
/**
 * ESLint flat config for the Cypress + TypeScript project.
 *
 * ESLint 10 (flat config is the only format — eslint.config.js).
 */
const js = require('@eslint/js')
const tseslint = require('typescript-eslint')
const cypress = require('eslint-plugin-cypress')
const prettier = require('eslint-config-prettier')

module.exports = tseslint.config(
  // Global ignores — keep them out of lint runs.
  {
    ignores: [
      'node_modules/**',
      'cypress/report/**',
      'cypress/results/**',
      'cypress/screenshots/**',
      'cypress/videos/**',
      'cypress.env.js',
    ],
  },

  // Base JS recommended rules.
  js.configs.recommended,

  // TypeScript recommended rules (type-aware not required for Cypress specs).
  ...tseslint.configs.recommended,

  // Cypress globals (cy, Cypress, describe, it, beforeEach, ...) and rules.
  {
    files: ['cypress/e2e/**/*.cy.ts', 'cypress/support/**/*.ts', 'cypress/pages/**/*.ts'],
    plugins: {
      cypress,
    },
    languageOptions: {
      globals: {
        cy: 'readonly',
        Cypress: 'readonly',
        describe: 'readonly',
        context: 'readonly',
        it: 'readonly',
        specify: 'readonly',
        before: 'readonly',
        beforeEach: 'readonly',
        after: 'readonly',
        afterEach: 'readonly',
      },
    },
    rules: {
      ...cypress.configs.recommended.rules,
      // Specs legitimately chain long sequences; keep it readable.
      'cypress/no-unnecessary-waiting': 'warn',
      'cypress/no-assigning-return-values': 'error',
      'cypress/unsafe-to-chain-command': 'off',
      // The app already exposes data-testid; enforcement is by convention.
      'cypress/require-data-selectors': 'off',
      // Allow describe/it patterns without explicit return types.
      // Cypress's Chainable<T> is invariant in T due to .and(); the idiomatic
      // pattern for action helpers is Cypress.Chainable<any>, so we turn this
      // off rather than littering the codebase with eslint-disable comments.
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      // Chai assertions like `expect(x).to.be.true` are flagged as unused
      // expressions; they are idiomatic in Cypress specs.
      '@typescript-eslint/no-unused-expressions': 'off',
    },
  },

  // Specs must not hand-roll content selectors: everything goes through the
  // page objects' data-testid getters. The rule stays off in page objects and
  // support files — that layer legitimately owns structural selectors (body
  // sanity checks, Radix [role="option"] portal options, the `main`-scoped
  // getters that filter the app's invisible duplicate DOM block).
  {
    files: ['cypress/e2e/**/*.cy.ts'],
    rules: {
      'cypress/require-data-selectors': 'error',
    },
  },

  // The Cypress config file runs in Node, not in the browser.
  {
    files: ['cypress.config.ts'],
    languageOptions: {
      globals: {
        console: 'readonly',
        require: 'readonly',
        module: 'readonly',
        process: 'readonly',
      },
    },
  },

  // Turn off all rules that conflict with Prettier formatting.
  prettier,
)
