import { homePage } from '@pages/HomePage'
import { productsPage } from '@pages/ProductsPage'
import type { ProductsFixture } from '@support/types'

/**
 * Search — header search (desktop) and listing search.
 */
describe('Search', () => {
  it('searches from the header on desktop viewport', () => {
    homePage.visit()
    cy.getByTestId('search-input').should('be.visible')
    cy.fixture<ProductsFixture>('products.json').then((fixture) => {
      const term = fixture.products[0].name.split(' ')[0]
      cy.getByTestId('search-input').type(`${term}{enter}`)
      cy.url().should('include', '/products')
      productsPage.getProductsCount().should('be.visible')
    })
  })

  it('searches from the listing input and shows matches', () => {
    productsPage.visit()
    cy.fixture<ProductsFixture>('products.json').then((fixture) => {
      const term = fixture.products[0].name
      productsPage.search(term)
      productsPage.getAllCards().should('have.length.gte', 1)
    })
  })

  it('shows the empty state for an unmatched search', () => {
    productsPage.visit()
    productsPage.search('zzzznomatchzzzz')
    productsPage.getNoProductsMessage().should('be.visible')
  })
})
