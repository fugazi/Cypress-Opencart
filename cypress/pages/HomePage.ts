import { BasePage } from './BasePage'

/**
 * Homepage ("/").
 */
export class HomePage extends BasePage {
  protected readonly path = '/'

  // Header
  getHeader(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('header')
  }
  getLogoLink(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('logo-link')
  }
  getNavHome(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('nav-home')
  }
  getNavProducts(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('nav-products')
  }
  getNavApiTest(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('nav-api-test')
  }
  getLoginButton(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('login-button')
  }

  // Footer
  getFooter(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('footer')
  }
  getFooterCopyright(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('footer-copyright')
  }
  getFooterLink(category: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId(`footer-link-${category.toLowerCase()}`)
  }

  // SEO
  assertMetaDescription(text: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy
      .get('head meta[name="description"]')
      .should('have.attr', 'content')
      .and('include', text)
  }
  assertMetaViewport(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy
      .get('head meta[name="viewport"]')
      .should('have.attr', 'content', 'width=device-width, initial-scale=1')
  }

  navigateToProducts(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getNavProducts().click()
  }
  navigateToLogin(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getLoginButton().click()
  }

  waitForPage(): Cypress.Chainable<any> {
    return this.getHeader().should('be.visible')
  }
}

export const homePage = new HomePage()
