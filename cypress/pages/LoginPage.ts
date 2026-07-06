import { BasePage } from './BasePage'

/**
 * Login page ("/login").
 *
 * The app ships demo accounts and exposes quick-fill buttons:
 *   - admin-account-button  -> admin@test.com / admin123
 *   - customer-account-button -> user@test.com / user123
 */
export class LoginPage extends BasePage {
  protected readonly path = '/login'

  getEmailInput(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('login-email-input')
  }
  getPasswordInput(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('login-password-input')
  }
  getSubmitButton(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('login-submit-button')
  }
  getCustomerQuickFill(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('customer-account-button')
  }
  getAdminQuickFill(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('admin-account-button')
  }
  getContinueAsGuestLink(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('continue-as-guest-link')
  }
  getEmailError(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('email-error-message')
  }
  getPasswordError(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('password-error-message')
  }
  getTogglePasswordVisibility(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('toggle-password-visibility')
  }

  fillCredentials(email: string, password: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy
      .then(() => this.getEmailInput().clear().type(email))
      .then(() => this.getPasswordInput().clear().type(password))
  }

  quickFillCustomer(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getCustomerQuickFill().click()
  }
  quickFillAdmin(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getAdminQuickFill().click()
  }

  submit(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getSubmitButton().click()
  }

  /** Full login flow via the UI. */
  login(email: string, password: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy
      .then(() => this.fillCredentials(email, password))
      .then(() => this.submit())
      .then(() => cy.getByTestId('user-menu-button').should('be.visible'))
  }

  continueAsGuest(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getContinueAsGuestLink().click()
  }

  waitForPage(): Cypress.Chainable<any> {
    return this.assertVisible('login-form')
  }
}

export const loginPage = new LoginPage()
