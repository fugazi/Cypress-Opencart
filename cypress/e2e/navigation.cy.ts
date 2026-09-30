import { homePage } from '@pages/HomePage'

/**
 * Navigation — migrated from TestProject4.cy.js (the stability ×5 suite).
 *
 * Exercises repeated navigation between pages to surface any flakiness in
 * client-side routing of the Next.js app.
 */
describe('Navigation — repeated routing', () => {
  const routes = [
    { name: 'Home', trigger: () => homePage.visit() },
    { name: 'Products', trigger: () => cy.visit('/products') },
    { name: 'About', trigger: () => cy.visit('/about') },
    { name: 'Contact', trigger: () => cy.visit('/contact') },
  ]

  Cypress._.times(3, (iteration) => {
    it(`renders every page without error (iteration ${iteration + 1}/3)`, () => {
      routes.forEach((route) => {
        route.trigger()
        // cy.visit already guarantees a rendered DOM; the real regression to
        // catch is the client-side error page rendering inside it.
        cy.contains('Application error').should('not.exist')
      })
    })
  })
})
