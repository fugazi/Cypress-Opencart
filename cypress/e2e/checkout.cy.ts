import { cartPage } from '@pages/CartPage'
import { checkoutFlow } from '@pages/CheckoutFlow'

/**
 * Checkout flow.
 *
 * The Music-Tech Shop app has no dedicated /checkout route. The "Complete
 * Purchase" button on /cart triggers a client-side flow: the cart is emptied
 * and the app navigates back to the storefront (Fase 2 runtime discovery —
 * there is no "Purchase Complete" toast; the empty cart + navigation ARE the
 * observable success contract).
 */
describe('Checkout — Complete Purchase', () => {
  beforeEach(() => {
    // /cart requires authentication; log in as the customer first.
    cy.loginAsCustomer()
  })

  it('completes a purchase: the cart empties and the app navigates home', () => {
    cy.clearCart()
    cy.getFirstProductId().then((id) => {
      cy.addProductToCart(id)
      cartPage.visit()
      checkoutFlow.completePurchase()
      checkoutFlow.assertPurchaseCompleted()
    })
  })

  it('does not render the checkout button when the cart is empty', () => {
    cy.clearCart()
    cartPage.visit()
    cartPage.getCheckoutButton().should('not.exist')
    cartPage.getEmptyCart().should('be.visible')
  })
})
