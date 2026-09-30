import { BasePage } from './BasePage'

/**
 * Product detail page ("/products/[slug]").
 *
 * The app renders an invisible (0x0) duplicate of the interactive block
 * (quantity selector, total, add-to-cart) OUTSIDE <main>; every interactive
 * getter is therefore scoped to `main` so reads and clicks hit the real,
 * rendered instance (Fase 2 runtime discovery).
 */
export class ProductDetailPage extends BasePage {
  protected readonly path = '/products'

  /** Scoped selector: only the instance rendered inside <main>. */
  private inMain(testId: string): string {
    return `main [data-testid="${testId}"]`
  }

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
    return cy.get(this.inMain('quantity-display'))
  }
  getIncreaseQuantity(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.inMain('quantity-increase-button'))
  }
  getDecreaseQuantity(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.inMain('quantity-decrease-button'))
  }
  getAddToCartButton(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.inMain('add-to-cart-button'))
  }
  getTotalPrice(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.inMain('total-price'))
  }
  getGalleryMainImage(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('gallery-main-image')
  }
  getShareFacebook(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('share-facebook-button')
  }
  getShareTwitter(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('share-twitter-button')
  }
  getShareLinkedIn(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('share-linkedin-button')
  }
  getCopyLink(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('copy-link-button')
  }
  getFeaturedProducts(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('featured-products-section')
  }

  /**
   * Increase the quantity until the display reaches current + n.
   *
   * The +/- handler swallows clicks that arrive within its ~100ms input
   * debounce (measured in runtime research: 0ms gap → +1, 120ms gap → +2) and
   * a click can also be lost to a re-render, so a single dispatch cannot be
   * assumed to register. clickQuantityUntil re-dispatches on each assertion
   * retry — rate-limited to 250ms, above the measured debounce, so clicks are
   * never double-counted — until the display shows the target value.
   */
  increaseQuantity(n = 1): Cypress.Chainable<any> {
    return cy.then(() => this.quantityBy('quantity-increase-button', n))
  }

  /** Mirror image of increaseQuantity. */
  decreaseQuantity(n = 1): Cypress.Chainable<any> {
    return cy.then(() => this.quantityBy('quantity-decrease-button', -n))
  }

  private quantityBy(buttonTestId: string, delta: number): Cypress.Chainable<any> {
    return cy
      .get('main [data-testid="quantity-display"]')
      .then(($d) => {
        const current = parseInt($d.text().trim(), 10) || 1
        return this.clickQuantityUntil(buttonTestId, current + delta)
      })
      .then(() => null)
  }

  private clickQuantityUntil(buttonTestId: string, target: number): Cypress.Chainable<any> {
    const selector = `main [data-testid="${buttonTestId}"]`
    let lastDispatchAt = 0
    return cy
      .get('main [data-testid="quantity-display"]')
      .should(($display) => {
        const current = parseInt($display.text().trim(), 10) || 0
        if (current !== target && Date.now() - lastDispatchAt > 250) {
          lastDispatchAt = Date.now()
          const doc = $display[0].ownerDocument
          const el = Array.from(doc.querySelectorAll<HTMLElement>(selector)).find(
            (e) => e.offsetWidth > 0 || e.offsetHeight > 0 || e.getClientRects().length > 0,
          )
          el?.click()
        }
        expect(current, `quantity display reaches ${target}`).to.equal(target)
      })
      .then(() => null)
  }

  addToCart(): Cypress.Chainable<void> {
    // The add-to-cart click updates cart state and re-renders the section;
    // native dispatch avoids losing the button mid-click (see clickTestId).
    return cy.clickTestId('add-to-cart-button', 'main')
  }

  waitForPage(): Cypress.Chainable<any> {
    return this.assertVisible('product-detail')
  }
}

export const productDetailPage = new ProductDetailPage()
