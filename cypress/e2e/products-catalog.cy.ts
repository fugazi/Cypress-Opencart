import { productsPage } from '@pages/ProductsPage'
import type { ProductsFixture } from '@support/types'

/**
 * Products catalog ("/products").
 *
 * The category/sort filters are shadcn/ui comboboxes (BUTTON[role=combobox]
 * with portal-rendered options), NOT native <select> elements — selection is
 * trigger click + option click (Fase 2 runtime discovery).
 */
describe('Products catalog', () => {
  beforeEach(() => {
    productsPage.visit()
  })

  it('renders at least one product card and the result count', () => {
    productsPage.getAllCards().should('have.length.gte', 1)
    productsPage.getProductsCount().should('be.visible').and('contain.text', 'products')
  })

  it('filters products by category', () => {
    cy.fixture<ProductsFixture>('products.json').then((fixture) => {
      const category = fixture.categories[0]
      productsPage.selectCategory(category)
      productsPage.getAllCards().should('have.length.gte', 1)
      productsPage.getAllCards().each(($card) => {
        const id = ($card.attr('data-testid') ?? '').replace('product-card-', '')
        productsPage
          .getByTestId(`product-category-${id}`)
          .invoke('text')
          .should('contain', category)
      })
    })
  })

  it('sorts products by price ascending', () => {
    cy.fixture<ProductsFixture>('products.json').then((fixture) => {
      productsPage.selectSort(fixture.sortOptions[0])
      productsPage.getAllCards().should('have.length.gte', 1)
      productsPage.getAllCards().then(($cards) => {
        const prices = $cards.toArray().map((card) => {
          const id = (card.getAttribute('data-testid') ?? '').replace('product-card-', '')
          const text = Cypress.$(`[data-testid="product-price-${id}"]`).text()
          return parseFloat(text.replace(/[^0-9.]/g, '')) || 0
        })
        const sorted = [...prices].sort((a, b) => a - b)
        expect(prices, 'visible prices are in ascending order').to.deep.equal(sorted)
      })
    })
  })

  it('paginates with next/prev controls', () => {
    productsPage.getPaginationNext().should('be.visible').and('not.be.disabled')
    productsPage.getPaginationNext().click()
    productsPage.getProductsCount().should('contain.text', 'Page 2')
    productsPage.getPaginationPrev().should('exist')
  })

  it('adds a product to the cart from the listing', () => {
    productsPage.getFirstProductId().then((id) => {
      productsPage.addToCart(id)
      // The cart badge in the header only renders once the cart has items.
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
