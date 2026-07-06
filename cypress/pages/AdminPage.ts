import { BasePage } from './BasePage'

/**
 * Admin panel ("/admin").
 *
 * Unlike the rest of the app, /admin has no data-testid attributes. Selectors
 * fall back to cy.contains() against the stable heading text.
 */
export class AdminPage extends BasePage {
  protected readonly path = '/admin'

  /** Assert a section heading is visible. */
  assertSection(heading: string): Cypress.Chainable<any> {
    return cy.contains('h1, h2, h3', heading).should('be.visible')
  }

  /** Assert a metric card label is visible. */
  assertMetricCard(label: string): Cypress.Chainable<any> {
    return cy.contains(label).should('be.visible')
  }

  /** Convenience: assert the dashboard's key metric cards. */
  assertKeyMetrics(): Cypress.Chainable<any> {
    const metrics = [
      'Total Revenue',
      'Total Orders',
      'Total Products',
      'Total Users',
      'Total Sales',
    ]
    metrics.forEach((m) => {
      cy.contains(m).should('be.visible')
    })
    return cy.wrap(null)
  }

  /** Convenience: assert the main admin sections. */
  assertMainSections(): Cypress.Chainable<any> {
    const sections = [
      'Admin Dashboard',
      'Revenue Overview',
      'Sales by Category',
      'Top Selling Products',
      'Order Status',
      'Recent Activity',
    ]
    sections.forEach((s) => {
      cy.contains(s).should('be.visible')
    })
    return cy.wrap(null)
  }

  waitForPage(): Cypress.Chainable<any> {
    return cy.get('h1').contains('Admin Dashboard').should('be.visible')
  }
}

export const adminPage = new AdminPage()
