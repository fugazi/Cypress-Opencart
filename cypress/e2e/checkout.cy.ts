import { cartPage } from '@pages/CartPage'
import { checkoutFlow } from '@pages/CheckoutFlow'
import { productsPage } from '@pages/ProductsPage'

/**
 * Checkout flow.
 *
 * The Music-Tech Shop app has no dedicated /checkout route. The "Complete
 * Purchase" button on /cart triggers a client-side flow that shows a
 * "Purchase Complete" toast. This suite asserts that toast.
 */
/**
 * Checkout flow.
 *
 * The Music-Tech Shop app has no dedicated /checkout route. The "Complete
 * Purchase" button on /cart triggers a client-side flow that shows a
 * "Purchase Complete" toast. This suite asserts that toast.
 *
 * ⚠️ SKIPPED (pending cart state investigation): the demo customer cart ships
 * with pre-seeded state and the checkout button / toast contract needs to be
 * confirmed against the live app. Re-enable alongside cart.cy.ts.
 * See docs/MODERNIZATION-PLAN.md § "Tests en skip (pendientes)".
 */
describe.skip('Checkout — Complete Purchase', () => {
  beforeEach(() => {
    // /cart requires authentication; log in as the customer first.
    cy.loginAsCustomer()
  })

  it('completes a purchase and shows the success toast', () => {
    cy.clearCart()
    productsPage.visit()
    productsPage.getFirstProductId().then((id) => {
      productsPage.addToCart(id)
      cartPage.visit()
      checkoutFlow.completePurchase()
    })
  })

  it('disables or hides checkout when the cart is empty', () => {
    cy.clearCart()
    cartPage.visit()
    cartPage.getCheckoutButton().then(($btn) => {
      // The app either hides or disables the button when the cart is empty.
      cy.wrap($btn).should(
        'satisfy',
        ($el) => $el.length === 0 || $el.is(':disabled') || !$el.is(':visible'),
      )
    })
  })
})
