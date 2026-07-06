import { homePage } from '@pages/HomePage'

/**
 * Homepage — migrated from TestProject1.cy.js.
 *
 * Validates the global header/footer, navigation and SEO meta tags of the
 * Music-Tech Shop homepage.
 */
describe('Homepage — Music-Tech Shop', () => {
  beforeEach(() => {
    homePage.visit()
  })

  it('displays the header with logo and primary navigation', () => {
    homePage.getHeader().should('be.visible')
    homePage.getLogoLink().should('be.visible').and('have.attr', 'href', '/')
    homePage.getNavHome().should('be.visible')
    homePage.getNavProducts().should('be.visible')
    homePage.getNavApiTest().should('be.visible')
  })

  it('shows the login link for anonymous users', () => {
    homePage.getLoginButton().should('be.visible').and('have.attr', 'href', '/login')
  })

  it('displays the footer with copyright and category links', () => {
    homePage.getFooter().should('be.visible')
    homePage.getFooterCopyright().should('contain', '2026')
    homePage.getFooterLink('Electronics').should('exist')
    homePage.getFooterLink('Accessories').should('exist')
    homePage.getFooterLink('Photography').should('exist')
  })

  it('exposes the correct SEO title and meta description', () => {
    cy.title().should('include', 'Music-Tech Shop')
    homePage.assertMetaDescription('music')
    homePage.assertMetaViewport()
  })

  it('navigates to the products page via the nav link', () => {
    homePage.navigateToProducts()
    cy.url().should('include', '/products')
  })
})
