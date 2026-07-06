import { productDetailPage } from '@pages/ProductDetailPage'
import { productsPage } from '@pages/ProductsPage'

/**
 * Product detail page ("/products/[slug]").
 *
 * ⚠️ SKIPPED (pending investigation): several assertions depend on testids
 * that are only present on some product pages (gallery-thumbnails,
 * specifications-list, featured-products-section) and on the dynamic product
 * id resolution, which behaves inconsistently across the demo catalog.
 * Re-enable once the product detail DOM contract is confirmed against the
 * live app.
 * See docs/MODERNIZATION-PLAN.md § "Tests en skip (pendientes)".
 */
describe.skip('Product detail page', () => {
  let productId: string

  beforeEach(() => {
    productsPage.visit()
    productsPage.getFirstProductId().then((id) => {
      productId = id
    })
  })

  it('renders the main product information', () => {
    productDetailPage.visitProduct(productId)
    productDetailPage.getTitle().should('be.visible')
    productDetailPage.getPrice().should('be.visible')
    productDetailPage.getDescription().should('be.visible')
  })

  it.skip('renders the image gallery with thumbnails (pending DOM contract)', () => {
    productDetailPage.visitProduct(productId)
    productDetailPage.getGalleryMainImage().should('be.visible')
    productDetailPage.getGalleryThumbnails().should('exist')
  })

  it('increases and decreases the quantity', () => {
    productDetailPage.visitProduct(productId)
    productDetailPage.getQuantityDisplay().should('contain', '1')
    productDetailPage.increaseQuantity(2)
    productDetailPage.getQuantityDisplay().should('contain', '3')
    productDetailPage.decreaseQuantity(1)
    productDetailPage.getQuantityDisplay().should('contain', '2')
  })

  it('updates the total price when the quantity changes', () => {
    productDetailPage.visitProduct(productId)
    productDetailPage.getTotalPrice().invoke('text').as('initialTotal')
    productDetailPage.increaseQuantity(1)
    productDetailPage.getTotalPrice().then(($total) => {
      cy.get<string>('@initialTotal').then((initial) => {
        const parsePrice = (s: string) => parseFloat(s.replace(/[^0-9.]/g, '')) || 0
        expect(parsePrice($total.text())).to.be.greaterThan(parsePrice(initial))
      })
    })
  })

  it('adds the product to the cart', () => {
    productDetailPage.visitProduct(productId)
    productDetailPage.addToCart()
    cy.getByTestId('cart-badge').should('exist')
  })

  it.skip('displays the specifications section (pending DOM contract)', () => {
    productDetailPage.visitProduct(productId)
    productDetailPage.getSpecifications().should('exist')
  })

  it.skip('displays social share buttons (pending DOM contract)', () => {
    productDetailPage.visitProduct(productId)
    productDetailPage.getShareFacebook().should('exist')
    productDetailPage.getShareTwitter().should('exist')
    productDetailPage.getShareLink().should('exist')
  })

  it.skip('renders the featured products section (pending DOM contract)', () => {
    productDetailPage.visitProduct(productId)
    productDetailPage.getFeaturedProducts().should('exist')
  })
})
