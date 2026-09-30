import { BasePage } from './BasePage'

/**
 * Products listing ("/products").
 *
 * Templated testids take the product id: product-card-${id},
 * product-add-to-cart-button-${id}, product-details-button-${id}.
 */
export class ProductsPage extends BasePage {
  protected readonly path = '/products'

  getSearchInput(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('search-products-input')
  }
  getCategoryFilter(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('category-filter')
  }
  getSortFilter(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('sort-filter')
  }
  getProductsCount(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('products-count')
  }
  getNoProductsMessage(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('no-products-message')
  }
  getPaginationNext(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('pagination-next')
  }
  getPaginationPrev(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('pagination-prev')
  }

  getProductCard(productId: string | number): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTemplate('product-card-${0}', productId)
  }
  getAddToCartButton(productId: string | number): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTemplate('product-add-to-cart-button-${0}', productId)
  }
  getDetailsButton(productId: string | number): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTemplate('product-details-button-${0}', productId)
  }
  getProductTitle(productId: string | number): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTemplate('product-title-link-${0}', productId)
  }
  getProductPrice(productId: string | number): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTemplate('product-price-${0}', productId)
  }

  /** All product cards currently rendered. */
  getAllCards(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-testid^="product-card-"]')
  }

  /**
   * A product id whose add-to-cart button is actually rendered. The id is read
   * from the add-to-cart buttons instead of the first card: during hydration
   * the grid briefly shows a pre-sort layout, so "first card" can return a
   * product whose button is not on the settled page.
   */
  getFirstProductId(): Cypress.Chainable<string> {
    return cy
      .get('[data-testid^="product-add-to-cart-button-"]')
      .first()
      .invoke('attr', 'data-testid')
      .then((testId) => (testId ?? '').replace('product-add-to-cart-button-', ''))
  }

  search(term: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getSearchInput().clear().type(`${term}{enter}`)
  }

  /**
   * The filters are shadcn/ui comboboxes, not native <select>: click the
   * trigger, then the portal-rendered option by its text.
   */
  selectCategory(option: string): Cypress.Chainable<any> {
    return this.getByTestId('category-filter')
      .click()
      .then(() => cy.get('[role="option"]').contains(option).click())
  }

  selectSort(option: string): Cypress.Chainable<any> {
    return this.getByTestId('sort-filter')
      .click()
      .then(() => cy.get('[role="option"]').contains(option).click())
  }

  addToCart(productId: string | number): Cypress.Chainable<void> {
    // Card buttons live in a selectively-hydrated subtree; native dispatch
    // avoids losing the click to the hydration replacement (see clickTestId).
    return cy.clickTestId(`product-add-to-cart-button-${productId}`)
  }

  openProduct(productId: string | number): Cypress.Chainable<void> {
    return cy.clickTestId(`product-details-button-${productId}`)
  }

  waitForPage(): Cypress.Chainable<any> {
    return cy
      .waitForProductsSettled()
      .get('[data-testid^="product-card-"]')
      .should('have.length.gte', 1)
      .first()
      .should('be.visible')
  }
}

export const productsPage = new ProductsPage()
