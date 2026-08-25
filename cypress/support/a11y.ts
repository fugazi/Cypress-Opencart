// ***********************************************************
// Accessibility helpers wrapping cypress-axe-core.
// ***********************************************************

import type { RunOptions } from 'axe-core'

/**
 * Axe rule set: WCAG 2.1 AA plus best practices.
 */
const AXE_TAGS: RunOptions['runOnly'] = {
  type: 'tag',
  values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'],
}

/**
 * Elements that Axe should ignore. The Vercel toolbar injects an iframe and
 * toast region with its own rules; flagging them would create noise.
 */
const A11Y_EXCLUDE_SELECTOR = 'iframe, [aria-label*="Notifications"], [data-sonner-toaster]'

/**
 * Run an accessibility check on the whole document (or a scoped selector).
 *
 * @example
 *   cy.runA11yCheck();                                  // whole document
 *   cy.runA11yCheck('[data-testid="login-form"]');      // scoped selector
 *
 * The Vercel toolbar / toast region is excluded so it does not produce noise.
 */
Cypress.Commands.add('runA11yCheck', (context?: string) => {
  cy.injectAxe()
  cy.checkA11y({
    axeOptions: {
      runOnly: AXE_TAGS,
      // Exclude overlay regions injected by Vercel / shadcn toasts.
      exclude: [[A11Y_EXCLUDE_SELECTOR]],
    },
    context: context as unknown as undefined,
  } as never)
})
