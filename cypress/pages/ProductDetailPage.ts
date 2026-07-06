import { BasePage } from './BasePage'

/**
 * Product detail page ("/products/[slug]").
 */
export class ProductDetailPage extends BasePage {
  protected readonly path = '/products'

  /** Visit a specific product by id/slug. */
  visitProduct(slug: string | number): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.visit(`/products/${slug}`).then(() => this.waitForPage())
  }

  getTitle(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('product-title')
  }
  getPrice(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('product-price')
  }
  getDescription(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('product-description')
  }
  getSpecifications(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('specifications-list')
  }
  getReviewsSection(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('product-reviews-section')
  }
  getReviews(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('review-user-name')
  }
  getQuantityDisplay(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('quantity-display')
  }
  getIncreaseQuantity(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('quantity-increase-button')
  }
  getDecreaseQuantity(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('quantity-decrease-button')
  }
  getAddToCartButton(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('add-to-cart-button')
  }
  getTotalPrice(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('total-price')
  }
  getGalleryMainImage(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('gallery-main-image')
  }
  getGalleryThumbnails(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('gallery-thumbnails')
  }
  getShareFacebook(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('share-facebook-button')
  }
  getShareTwitter(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('share-twitter-button')
  }
  getShareLink(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('share-link-button')
  }
  getFeaturedProducts(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('featured-products-section')
  }

  /** Increase quantity by n clicks. */
  increaseQuantity(n = 1): Cypress.Chainable<any> {
    return cy.then(() => {
      for (let i = 0; i < n; i += 1) {
        cy.getByTestId('quantity-increase-button').click()
      }
    })
  }

  decreaseQuantity(n = 1): Cypress.Chainable<any> {
    return cy.then(() => {
      for (let i = 0; i < n; i += 1) {
        cy.getByTestId('quantity-decrease-button').click()
      }
    })
  }

  addToCart(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getAddToCartButton().click()
  }

  waitForPage(): Cypress.Chainable<any> {
    return this.assertVisible('product-detail')
  }
}

export const productDetailPage = new ProductDetailPage()
