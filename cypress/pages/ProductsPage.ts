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

  /** First product id on the listing (resolved from the templated testid). */
  getFirstProductId(): Cypress.Chainable<string> {
    return this.getAllCards()
      .first()
      .invoke('attr', 'data-testid')
      .then((testId) => (testId ?? '').replace('product-card-', ''))
  }

  search(term: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getSearchInput().clear().type(`${term}{enter}`)
  }

  filterByCategory(category: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getCategoryFilter().select(category)
  }

  sortBy(option: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getSortFilter().select(option)
  }

  addToCart(productId: string | number): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getAddToCartButton(productId).click()
  }

  openProduct(productId: string | number): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getDetailsButton(productId).click()
  }

  waitForPage(): Cypress.Chainable<any> {
    return cy
      .get('[data-testid^="product-card-"]')
      .should('have.length.gte', 1)
      .first()
      .should('be.visible')
  }
}

export const productsPage = new ProductsPage()
