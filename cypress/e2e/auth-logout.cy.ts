/**
 * Authentication — logout flow. Migrated from TestProject3.cy.js (logout half).
 */
describe('Authentication — logout', () => {
  it('logs the customer out via the user menu', () => {
    cy.loginAsCustomer()
    cy.logout()
    // After logout the login link reappears in the header.
    cy.getByTestId('login-button').should('be.visible')
  })

  it('logs the admin out via the user menu', () => {
    cy.loginAsAdmin()
    cy.logout()
    cy.getByTestId('login-button').should('be.visible')
  })
})
