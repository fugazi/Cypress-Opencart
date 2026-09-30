import { BasePage } from './BasePage'

/**
 * Wishlist ("/wishlist").
 */
export class WishlistPage extends BasePage {
  protected readonly path = '/wishlist'

  getTitle(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('wishlist-title')
  }
  getSubtitle(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('wishlist-subtitle')
  }
  getEmptyWishlist(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('empty-wishlist')
  }
  getBrowseProductsButton(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('browse-products-button')
  }
  getRemoveButton(productId: string | number): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTemplate('remove-wishlist-${0}', productId)
  }

  /**
   * Whether the empty state is currently rendered. The wishlist may or may
   * not be empty depending on prior session state, so specs branch on this.
   */
  isEmptyState(): Cypress.Chainable<boolean> {
    return cy
      .document()
      .then((doc) => doc.querySelectorAll('[data-testid="empty-wishlist"]').length > 0)
  }

  browseProducts(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getBrowseProductsButton().click()
  }

  removeItem(productId: string | number): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getRemoveButton(productId).click()
  }

  waitForPage(): Cypress.Chainable<any> {
    return this.assertVisible('wishlist-page')
  }
}

export const wishlistPage = new WishlistPage()
