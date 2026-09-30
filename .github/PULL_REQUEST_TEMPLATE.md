# Pull Request

## Description

<!-- What does this PR do? Link related issues with "Closes #N". -->

## Type of change

- [ ] Test suite change (specs / page objects / commands)
- [ ] Tooling & dependencies (ESLint, Prettier, reporters, hooks)
- [ ] Documentation
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)

## Changes made

<!-- Bullet list of the main changes. -->

-

## How has this been tested?

<!-- How was this validated locally? This project has no CI: every PR must
     state the local validation performed. -->

- [ ] `npm run lint` clean
- [ ] `npx tsc --noEmit` clean
- [ ] `npx prettier --check "cypress/**/*.ts" "*.md" "**/*.md"` clean
- [ ] `npm run cy:run` — full suite green (N/N passing)

## Checklist

- [ ] Selectors go through `data-testid` (page objects); `cypress/require-data-selectors` passes
- [ ] No hardcoded waits (`cy.wait`) or `force: true` added without justification
- [ ] Docs updated (`README.md`, `docs/MODERNIZATION-PLAN-V2.md`) if this changes the suite's state
- [ ] Commits follow the repo's conventional style
