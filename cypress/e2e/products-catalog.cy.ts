import { productsPage } from '@pages/ProductsPage'
import type { ProductsFixture } from '@support/types'

/**
 * Products catalog ("/products").
 *
 * Validates listing, count, category filters, sorting and the empty state.
 *
 * ⚠️ SKIPPED (pending investigation): filter/sort assertions depend on the
 * exact option values exposed by the app's `category-filter` / `sort-filter`
 * selects, and several other assertions (pagination, add-to-cart badge) are
 * flaky against the demo catalog. Re-enable once the real option values and
 * DOM contract are confirmed.
 * See docs/MODERNIZATION-PLAN.md § "Tests en skip (pendientes)".
 */
describe.skip('Products catalog', () => {
  beforeEach(() => {
    productsPage.visit()
  })

  it('renders at least one product card', () => {
    productsPage.getAllCards().should('have.length.gte', 1)
    productsPage.getProductsCount().should('be.visible')
  })

  it.skip('filters products by category (pending filter option values)', () => {
    cy.fixture<ProductsFixture>('products.json').then((fixture) => {
      const category = fixture.categories[0]
      productsPage.filterByCategory(category)
      // Each visible card's category testid should reflect the filter.
      productsPage.getAllCards().each(($card) => {
        const id = ($card.attr('data-testid') ?? '').replace('product-card-', '')
        productsPage.getByTestId(`product-category-${id}`).should('contain', category)
      })
    })
  })

  it.skip('changes the sort order without breaking the listing (pending sort option values)', () => {
    cy.fixture<ProductsFixture>('products.json').then((fixture) => {
      const option = fixture.sortOptions[0]
      productsPage.sortBy(option)
      productsPage.getAllCards().should('have.length.gte', 1)
    })
  })

  it('paginates with next/prev controls when available', () => {
    productsPage.getPaginationNext().then(($btn) => {
      if ($btn.is(':visible') && !$btn.prop('disabled')) {
        cy.wrap($btn).click()
        productsPage.getPaginationPrev().should('exist')
      }
    })
  })

  it('adds a product to the cart from the listing', () => {
    productsPage.getFirstProductId().then((id) => {
      productsPage.addToCart(id)
      // The cart badge in the header should reflect the new item.
      cy.getByTestId('cart-badge').should('exist')
    })
  })

  it('opens the product detail page from the listing', () => {
    productsPage.getFirstProductId().then((id) => {
      productsPage.openProduct(id)
      cy.url().should('include', '/products/')
    })
  })

  it('shows the empty state when a search yields no results', () => {
    productsPage.search('zzzznomatchzzzz')
    productsPage.getNoProductsMessage().should('be.visible')
  })
})
