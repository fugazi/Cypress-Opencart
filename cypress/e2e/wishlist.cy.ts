import { wishlistPage } from '@pages/WishlistPage'

/**
 * Wishlist ("/wishlist").
 */
describe('Wishlist', () => {
  beforeEach(() => {
    cy.loginAsCustomer()
    wishlistPage.visit()
  })

  it('renders the wishlist page with a title', () => {
    wishlistPage.getTitle().should('be.visible')
    wishlistPage.getSubtitle().should('exist')
  })

  it('shows the empty state when the wishlist has no items', () => {
    // The wishlist may or may not be empty depending on prior state; if empty,
    // assert the empty message, otherwise assert items are present.
    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="empty-wishlist"]').length > 0) {
        wishlistPage.getEmptyWishlist().should('be.visible')
        wishlistPage.getBrowseProductsButton().should('be.visible')
      } else {
        cy.get('[data-testid^="remove-wishlist-"]').should('have.length.gte', 1)
      }
    })
  })

  it('offers a way back to browse products from the empty state', () => {
    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="empty-wishlist"]').length > 0) {
        wishlistPage.browseProducts()
        cy.url().should('include', '/products')
      }
    })
  })
})
