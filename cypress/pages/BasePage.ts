/**
 * Base page object.
 *
 * All Music-Tech Shop page objects extend this class. It centralises the
 * data-testid selector strategy and the common wait/navigation helpers.
 */
export abstract class BasePage {
  /** Path under baseUrl, e.g. "/products". Override in subclasses. */
  protected abstract readonly path: string

  /** Visit this page's path relative to baseUrl. */
  visit(): Cypress.Chainable<any> {
    return cy.visit(this.path).then(() => this.waitForPage())
  }

  /**
   * Resolve a templated testid by interpolating one or more ids.
   * @example this.testid('product-card-${0}', productId)
   */
  protected testid(template: string, ...ids: Array<string | number>): string {
    return template.replace(/\$\{(\d+)\}/g, (_, idx) => String(ids[Number(idx)]))
  }

  /** Get an element by data-testid. */
  getByTestId(testId: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.getByTestId(testId)
  }

  /** Get an element by a templated data-testid. */
  getByTemplate(
    template: string,
    ...ids: Array<string | number>
  ): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.getByTestId(this.testid(template, ...ids))
  }

  /** Click an element identified by data-testid. */
  clickByTestId(testId: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.getByTestId(testId).click()
  }

  /** Assert an element identified by data-testid is visible. */
  assertVisible(testId: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.getByTestId(testId).should('be.visible')
  }

  /** Assert the browser URL contains the given substring. */
  assertUrlContains(fragment: string): Cypress.Chainable<string> {
    return cy.url().should('include', fragment)
  }

  /** Assert the page <title> contains the given text. */
  assertTitleContains(text: string): Cypress.Chainable<string> {
    return cy.title().should('include', text)
  }

  /**
   * Hook to wait for the page to be ready. Subclasses override to wait for
   * a page-specific element (e.g. the products grid). Default: resolves body.
   */
  waitForPage(): Cypress.Chainable<any> {
    return cy.get('body')
  }
}
