import { adminPage } from '@pages/AdminPage'

/**
 * Admin panel ("/admin").
 *
 * Unlike the rest of the app, /admin has no data-testid attributes, so
 * assertions use cy.contains() against the page text. Fase 2 runtime
 * discovery: real headings are "Admin Dashboard" (h1), "Key Metrics",
 * "Order Status" and "Analytics"; "Revenue Overview", "Sales by Category",
 * "Top Selling Products" and "Recent Activity" are section labels inside
 * the Analytics area, not heading elements.
 */
describe('Admin panel', () => {
  beforeEach(() => {
    cy.loginAsAdmin()
    adminPage.visit()
  })

  it('renders the admin dashboard heading', () => {
    adminPage.assertSection('Admin Dashboard')
  })

  it('renders all key metric cards', () => {
    adminPage.assertKeyMetrics()
  })

  it('renders the main admin sections', () => {
    adminPage.assertMainSections()
  })

  it('renders the Revenue Overview chart section', () => {
    adminPage.assertSection('Revenue Overview')
  })

  it('renders the Sales by Category section', () => {
    adminPage.assertSection('Sales by Category')
  })

  it('renders the Top Selling Products section', () => {
    adminPage.assertSection('Top Selling Products')
  })

  it('renders the Recent Activity section', () => {
    adminPage.assertSection('Recent Activity')
  })
})
