import { BasePage } from './BasePage'

/**
 * Checkout flow.
 *
 * The Music-Tech Shop app has NO dedicated /checkout route. The "Complete
 * Purchase" button on /cart triggers a client-side flow that shows a
 * "Purchase Complete" toast. This object encapsulates asserting that toast.
 */
export class CheckoutFlow extends BasePage {
  // There is no dedicated page, so we stay on /cart.
  protected readonly path = '/cart'

  /** Assert the success toast appears after Complete Purchase. */
  assertPurchaseCompleteToast(): Cypress.Chainable<any> {
    return cy.contains(/purchase complete/i).should('be.visible')
  }

  /** Trigger checkout from /cart and assert the success toast. */
  completePurchase(): Cypress.Chainable<any> {
    return cy
      .getByTestId('checkout-button')
      .click()
      .then(() => this.assertPurchaseCompleteToast())
  }

  waitForPage(): Cypress.Chainable<any> {
    return cy.get('body')
  }
}

export const checkoutFlow = new CheckoutFlow()
