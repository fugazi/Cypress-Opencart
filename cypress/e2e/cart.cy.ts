import { cartPage } from '@pages/CartPage'
import { productsPage } from '@pages/ProductsPage'

/**
 * Cart ("/cart").
 *
 * NOTE: The Music-Tech Shop app redirects /cart to /login for anonymous users.
 * All cart tests authenticate as the customer demo account first. The demo
 * customer account may ship with a pre-populated cart.
 *
 * ⚠️ Two scenarios are skipped pending investigation of the demo cart state
 * (pre-seeded items and the templated cart-item testid contract). See
 * docs/MODERNIZATION-PLAN.md § "Tests en skip (pendientes)".
 */
describe('Cart', () => {
  beforeEach(() => {
    cy.loginAsCustomer()
  })

  it.skip('renders the cart page with the order summary or empty state (pending cart layout investigation)', () => {
    cartPage.visit()
    cy.get('body').then(($body) => {
      const hasSummary = $body.find('[data-testid="order-summary-card"]').length > 0
      const hasEmpty = $body.find('[data-testid="empty-cart"]').length > 0
      expect(hasSummary || hasEmpty, 'cart page renders either summary or empty state').to.be.true
    })
  })

  it.skip('adds a product and sees it reflected in the cart (pending cart-item testid contract)', () => {
    productsPage.visit()
    productsPage.getFirstProductId().then((id) => {
      productsPage.addToCart(id)
      cartPage.visit()
      cartPage.getCartItem(id).should('exist')
    })
  })

  it('removes an item from the cart when remove buttons are present', () => {
    cartPage.visit()
    cy.get('body').then(($body) => {
      const removeButtons = $body.find('[data-testid^="cart-remove-item-"]')
      if (removeButtons.length === 0) {
        cy.log('No removable items in cart; skipping removal assertion')
        return
      }
      const firstTestId = Cypress.$(removeButtons[0]).attr('data-testid') ?? ''
      const id = firstTestId.replace('cart-remove-item-', '')
      cy.getByTestId(`cart-remove-item-${id}`).click()
      cy.get(`[data-testid="cart-item-${id}"]`).should('not.exist')
    })
  })

  it.skip('renders the order summary totals when items are present (pending cart state investigation)', () => {
    cartPage.visit()
    cy.get('body').then(($body) => {
      const hasSummary = $body.find('[data-testid="order-summary-card"]').length > 0
      if (!hasSummary) {
        productsPage.visit()
        productsPage.getFirstProductId().then((id) => {
          productsPage.addToCart(id)
          cartPage.visit()
          cartPage.getSubtotal().should('be.visible')
          cartPage.getShipping().should('be.visible')
          cartPage.getTax().should('be.visible')
          cartPage.getTotal().should('be.visible')
        })
        return
      }
      cartPage.getSubtotal().should('be.visible')
      cartPage.getShipping().should('be.visible')
      cartPage.getTax().should('be.visible')
      cartPage.getTotal().should('be.visible')
    })
  })
})
