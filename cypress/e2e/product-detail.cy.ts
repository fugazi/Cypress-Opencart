import { productDetailPage } from '@pages/ProductDetailPage'
import { productsPage } from '@pages/ProductsPage'

/**
 * Product detail page ("/products/[slug]").
 *
 * Fase 2 runtime discovery: every product renders the full page (specs,
 * share, reviews, featured). The gallery has a main image but NO thumbnails
 * element, and the share row exposes a "copy link" button instead of a
 * "share link" one.
 */
describe('Product detail page', () => {
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

  it('renders the image gallery with the main image', () => {
    productDetailPage.visitProduct(productId)
    productDetailPage.assertVisible('product-image-gallery')
    productDetailPage.getGalleryMainImage().should('be.visible')
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
    const parsePrice = (s: string) => parseFloat(s.replace(/[^0-9.]/g, '')) || 0
    let initial = 0
    productDetailPage
      .getTotalPrice()
      .invoke('text')
      .then((text) => {
        initial = parsePrice(text)
      })
    productDetailPage.increaseQuantity(1)
    // Retryable read: a one-shot .then() can capture the pre-commit node and
    // compare a stale total.
    productDetailPage.getTotalPrice().should(($total) => {
      expect(parsePrice($total.text()), 'total updates with quantity').to.be.greaterThan(initial)
    })
  })

  it('adds the product to the cart', () => {
    // Discovered app contract (Fase 2): add-to-cart requires authentication —
    // anonymously the app redirects to /login?redirect=... instead of adding.
    cy.loginAsCustomer()
    productDetailPage.visitProduct(productId)
    productDetailPage.addToCart()
    cy.getByTestId('cart-badge').should('exist')
  })

  it('displays the specifications section', () => {
    productDetailPage.visitProduct(productId)
    productDetailPage.getSpecifications().should('exist')
  })

  it('displays social share buttons', () => {
    productDetailPage.visitProduct(productId)
    productDetailPage.getShareFacebook().should('exist')
    productDetailPage.getShareTwitter().should('exist')
    productDetailPage.getShareLinkedIn().should('exist')
    productDetailPage.getCopyLink().should('exist')
  })

  it('renders the featured products section', () => {
    productDetailPage.visitProduct(productId)
    productDetailPage.getFeaturedProducts().should('exist')
  })
})
