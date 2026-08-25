import { BasePage } from './BasePage'

/**
 * Shopping cart ("/cart").
 */
export class CartPage extends BasePage {
  protected readonly path = '/cart'

  getEmptyCart(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('empty-cart')
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

  removeItem(productId: string | number): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getRemoveItemButton(productId).click()
  }

  checkout(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getCheckoutButton().click()
  }

  waitForPage(): Cypress.Chainable<any> {
    // The cart layout varies: with items it shows order-summary-card, when
    // empty it shows empty-cart, and on auth redirect it shows the login form.
    // Just wait for the body to be visible; individual specs assert the
    // specific elements they need.
    return cy.get('body').should('be.visible')
  }
}

export const cartPage = new CartPage()
