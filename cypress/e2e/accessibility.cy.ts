/**
 * Accessibility — runs axe-core checks on the main flows.
 *
 * Uses the runA11yCheck() helper from cypress/support/a11y.ts which wraps
 * cypress-axe-core. Reactivated in Fase 2 (paso 7): the Vercel toolbar and
 * sonner toast regions are excluded from the scan, and only critical/serious
 * violations fail the check (see the helper for the severity rationale).
 */
describe('Accessibility (a11y)', () => {
  it('homepage has no critical axe violations', () => {
    cy.visit('/')
    cy.runA11yCheck()
  })

  it('products listing has no critical axe violations', () => {
    cy.visit('/products')
    cy.waitForProductsSettled()
    cy.get('[data-testid^="product-card-"]').should('have.length.gte', 1)
    cy.runA11yCheck()
  })

  it('login page has no critical axe violations', () => {
    cy.visit('/login')
    cy.getByTestId('login-form').should('be.visible')
    cy.runA11yCheck('[data-testid="login-form"]')
  })

  it('cart page has no critical axe violations', () => {
    // /cart requires authentication and renders either the order summary or
    // the empty state depending on the cart contents.
    cy.loginAsCustomer()
    cy.visit('/cart')
    cy.get('[data-testid="order-summary-card"], [data-testid="empty-cart"]').should('exist')
    cy.runA11yCheck()
  })

  it('dashboard has no critical axe violations', () => {
    cy.loginAsCustomer()
    cy.visit('/dashboard')
    cy.getByTestId('dashboard-sidebar').should('be.visible')
    cy.runA11yCheck()
  })
})
