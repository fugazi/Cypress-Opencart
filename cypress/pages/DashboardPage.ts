import { BasePage } from './BasePage'

/**
 * Customer dashboard ("/dashboard").
 */
export class DashboardPage extends BasePage {
  protected readonly path = '/dashboard'

  getSidebar(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('dashboard-sidebar')
  }
  getStats(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('dashboard-stats')
  }
  getSpendingChart(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('spending-chart')
  }
  getCategoryChart(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('category-chart')
  }
  getOrderStatusCards(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('order-status-cards')
  }
  getRecentOrdersCard(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('recent-orders-card')
  }
  getRecentActivity(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('recent-activity')
  }
  getWishlistPreview(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.getByTestId('wishlist-preview-card')
  }

  waitForPage(): Cypress.Chainable<any> {
    return this.assertVisible('dashboard-sidebar')
  }
}

export const dashboardPage = new DashboardPage()
