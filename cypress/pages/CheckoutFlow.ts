import { BasePage } from './BasePage'

/**
 * Checkout flow.
 *
 * The Music-Tech Shop app has NO dedicated /checkout route. The "Complete
 * Purchase" button on /cart triggers a client-side flow: the cart is emptied
 * and the app navigates back to the storefront. There is no success toast —
 * the observable contract is the navigation + the empty cart.
 */
export class CheckoutFlow extends BasePage {
  // There is no dedicated page, so we stay on /cart.
  protected readonly path = '/cart'

  /** Trigger checkout from /cart. */
  completePurchase(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.getByTestId('checkout-button').should('be.visible').click()
  }

  /**
   * Assert the observable success contract: the app leaves /cart and the
   * cart is empty afterwards.
   */
  assertPurchaseCompleted(): Cypress.Chainable<JQuery<HTMLElement>> {
    cy.url().should('not.include', '/cart')
    cy.visit('/cart')
    return cy.getByTestId('empty-cart').should('be.visible')
  }

  waitForPage(): Cypress.Chainable<any> {
    return cy.get('body')
  }
}

export const checkoutFlow = new CheckoutFlow()
