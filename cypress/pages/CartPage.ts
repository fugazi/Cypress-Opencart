import { BasePage } from './BasePage'

/**
 * Shopping cart ("/cart").
 */
export class CartPage extends BasePage {
  protected readonly path = '/cart'

  getEmptyCart(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('empty-cart')
  }
  /**
   * Either cart state: the order summary (items present) or the empty state.
   * A single comma selector keeps the assertion retryable — the whole cart
   * section is client-rendered and neither testid exists before hydration.
   */
  getCartSection(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-testid="order-summary-card"], [data-testid="empty-cart"]')
  }
  getSubtotal(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('cart-subtotal')
  }
  getShipping(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('cart-shipping')
  }
  getTax(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('cart-tax')
  }
  getTotal(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('cart-total')
  }
  getCheckoutButton(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('checkout-button')
  }
  getFreeShippingLabel(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('free-shipping-label')
  }
  getFreeShippingThreshold(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('free-shipping-threshold')
  }
  getItemName(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('cart-item-product-name')
  }
  getCartItem(productId: string | number): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTemplate('cart-item-${0}', productId)
  }
  getRemoveItemButton(productId: string | number): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTemplate('cart-remove-item-${0}', productId)
  }
  getQuantity(productId: string | number): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTemplate('cart-quantity-${0}', productId)
  }
  getIncreaseQuantityButton(productId: string | number): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTemplate('cart-increase-quantity-${0}', productId)
  }
  getDecreaseQuantityButton(productId: string | number): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTemplate('cart-decrease-quantity-${0}', productId)
  }
  getItemTotalPrice(productId: string | number): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTemplate('cart-item-total-price-${0}', productId)
  }

  /** All cart items currently rendered. */
  getAllItems(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-testid^="cart-item-"]').not('[data-testid^="cart-item-product"]')
  }

  /** All remove-item buttons currently rendered. */
  getAllRemoveButtons(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-testid^="cart-remove-item-"]')
  }

  removeItem(productId: string | number): Cypress.Chainable<void> {
    // Removing an item re-renders the cart list; the native dispatch avoids
    // losing the button to its own re-render (see clickTestId docs).
    return cy.clickTestId(`cart-remove-item-${productId}`)
  }

  checkout(): Cypress.Chainable<void> {
    return cy.clickTestId('checkout-button')
  }

  waitForPage(): Cypress.Chainable<any> {
    // The cart section is client-rendered: with items it shows
    // order-summary-card, when empty it shows empty-cart. The comma selector
    // resolves once either state hydrates; on auth redirect it never does and
    // the timeout surfaces the redirect.
    return this.getCartSection().should('exist')
  }
}

export const cartPage = new CartPage()
