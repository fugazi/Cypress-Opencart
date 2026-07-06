// ***********************************************************
// This support file is loaded automatically before each spec.
// ***********************************************************

// Mochawesome reporter hooks (screenshots, after-all hooks).
import 'cypress-mochawesome-reporter/register'

// Accessibility helpers from cypress-axe-core (cy.injectAxe / cy.checkA11y).
import 'cypress-axe-core'

// Custom commands and Page Object helpers.
import './commands'
import './a11y'

/**
 * Global behaviour applied to every spec.
 */
beforeEach(() => {
  // Vercel injects a toolbar overlay (aria-label="Notifications (F8)") and the
  // app has a theme toggle. These can intercept clicks; clear them up front.
  cy.dismissOverlays()

  // Default to desktop interactions; specs that need mobile can override.
  cy.viewport(1280, 720)
})

// Surface uncaught app errors as test failures so regressions are noisy.
Cypress.on('uncaught:exception', () => {
  // Returning false here would silently swallow app errors; instead we let
  // them propagate so specs fail loudly on real regressions.
  return true
})
