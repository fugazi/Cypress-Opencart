import { loginPage } from '@pages/LoginPage'
import { homePage } from '@pages/HomePage'
import type { UsersFixture } from '@support/types'

/**
 * Authentication — login flow. Migrated from TestProject3.cy.js.
 *
 * The Music-Tech Shop app ships demo accounts with quick-fill buttons on
 * /login. There is no public registration; auth is performed via these
 * demo credentials.
 */
describe('Authentication — login', () => {
  beforeEach(() => {
    loginPage.visit()
  })

  it('renders the login form with the expected fields', () => {
    loginPage.getEmailInput().should('be.visible')
    loginPage.getPasswordInput().should('be.visible')
    loginPage.getSubmitButton().should('be.visible')
    loginPage.getCustomerQuickFill().should('be.visible')
    loginPage.getAdminQuickFill().should('be.visible')
    loginPage.getContinueAsGuestLink().should('be.visible')
  })

  it('logs in as the customer demo account via quick-fill', () => {
    loginPage.quickFillCustomer()
    loginPage.submit()
    // The user-menu button only appears in the header when authenticated.
    cy.getByTestId('user-menu-button').should('be.visible')
  })

  it('logs in as the admin demo account via quick-fill', () => {
    loginPage.quickFillAdmin()
    loginPage.submit()
    cy.getByTestId('user-menu-button').should('be.visible')
  })

  it('logs in by typing credentials from the fixture', () => {
    cy.fixture<UsersFixture>('users.json').then((users) => {
      loginPage.login(users.customer.email, users.customer.password)
    })
    cy.getByTestId('user-menu-button').should('be.visible')
  })

  it('shows validation errors when submitting an empty form', () => {
    loginPage.submit()
    loginPage.getEmailError().should('be.visible')
    loginPage.getPasswordError().should('be.visible')
  })

  it('toggles the password visibility', () => {
    loginPage.getPasswordInput().should('have.attr', 'type', 'password')
    loginPage.getTogglePasswordVisibility().click()
    loginPage.getPasswordInput().should('have.attr', 'type', 'text')
  })

  it('continues as guest and returns to the store', () => {
    loginPage.continueAsGuest()
    // After "continue as guest" the user lands on the homepage (not logged in).
    homePage.getLoginButton().should('be.visible')
  })
})
