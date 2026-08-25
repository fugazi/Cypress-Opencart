import { BasePage } from './BasePage'

/**
 * API test harness ("/api-test").
 *
 * The app ships a built-in playground that invokes the real backend
 * (/api/*): auth, cart, products, orders. It is the canonical way to
 * discover the actual API surface in runtime (the endpoints are not
 * string-literal in the bundle).
 */
export class ApiTestPage extends BasePage {
  protected readonly path = '/api-test'

  getConfig(
    key: 'email' | 'password' | 'product-id' | 'quantity' | 'search-term' | 'category' | 'title',
  ): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId(`config-${key}`)
  }

  getAuthToggle(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('auth-tests-toggle')
  }
  getCartToggle(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('cart-tests-toggle')
  }
  getProductsToggle(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('product-tests-toggle')
  }
  getOrdersToggle(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('order-tests-toggle')
  }

  getAuthLoginButton(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('auth-login-button')
  }
  getAuthGetUserButton(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('auth-get-user-button')
  }
  getAuthLogoutButton(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('auth-logout-button')
  }

  getCartAddButton(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('cart-add-button')
  }
  getCartGetButton(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('cart-get-button')
  }
  getCartUpdateButton(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('cart-update-button')
  }
  getCartRemoveButton(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('cart-remove-button')
  }
  getCartClearButton(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('cart-clear-button')
  }

  getProductsGetAllButton(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('products-get-all-button')
  }
  getProductsGetSingleButton(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('products-get-single-button')
  }

  getOrderCreateButton(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('order-create-button')
  }
  getOrderGetButton(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('order-get-button')
  }

  getUtilityResetButton(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('utility-reset-button')
  }

  /**
   * Click a button inside a collapsible harness section. The auth and products
   * sections render open by default; utility/cart/orders start collapsed, so
   * the toggle is clicked only when the target button is absent from the DOM.
   */
  clickSectionButton(toggle: string, button: string): Cypress.Chainable<any> {
    return cy.get('body').then(($body) => {
      if ($body.find(`[data-testid="${button}"]`).length === 0) {
        cy.getByTestId(toggle).first().click()
      }
      return cy.getByTestId(button).first().click()
    })
  }

  getResponseOutput(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('response-output')
  }
  getAuthenticatedBadge(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('authenticated-badge')
  }

  waitForPage(): Cypress.Chainable<any> {
    return this.assertVisible('api-test-page')
  }
}

export const apiTestPage = new ApiTestPage()
