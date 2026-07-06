import { dashboardPage } from '@pages/DashboardPage'

/**
 * Customer dashboard ("/dashboard").
 */
describe('Dashboard', () => {
  beforeEach(() => {
    cy.loginAsCustomer()
    dashboardPage.visit()
  })

  it('renders the sidebar navigation', () => {
    dashboardPage.getSidebar().should('be.visible')
  })

  it('renders the stats section', () => {
    dashboardPage.getStats().should('exist')
  })

  it('renders the spending chart', () => {
    dashboardPage.getSpendingChart().should('exist')
  })

  it('renders the category distribution chart', () => {
    dashboardPage.getCategoryChart().should('exist')
  })

  it('renders the order status cards', () => {
    dashboardPage.getOrderStatusCards().should('exist')
  })

  it('renders the recent orders card', () => {
    dashboardPage.getRecentOrdersCard().should('exist')
  })

  it('renders the recent activity feed', () => {
    dashboardPage.getRecentActivity().should('exist')
  })

  it('renders the wishlist preview card', () => {
    dashboardPage.getWishlistPreview().should('exist')
  })
})
