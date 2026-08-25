import { cartPage } from '@pages/CartPage'

/**
 * Cart ("/cart").
 *
 * Requires authentication — anonymous users are redirected to /login.
 *
 * Cart DOM contract (Fase 2 runtime discovery): items render
 * `cart-item-${id}` with per-item quantity controls (`cart-increase/decrease-
 * quantity-${id}`) and an order summary; the empty state renders
 * `empty-cart` and NO checkout button. All cart state is client-side.
 */
describe('Cart', () => {
  beforeEach(() => {
    cy.loginAsCustomer()
  })

  it('renders the order summary or the empty state', () => {
    cartPage.visit()
    cy.get('body').then(($body) => {
      const hasSummary = $body.find('[data-testid="order-summary-card"]').length > 0
      const hasEmpty = $body.find('[data-testid="empty-cart"]').length > 0
      expect(hasSummary || hasEmpty, 'cart renders either the summary or the empty state').to.be
        .true
    })
  })

  it('adds a product and sees it reflected in the cart', () => {
    cy.clearCart()
    cy.getFirstProductId().then((id) => {
      cy.addProductToCart(id)
      cartPage.visit()
      cartPage.getCartItem(id).should('be.visible')
      cartPage.getItemName().should('be.visible')
      cartPage.assertVisible('order-summary-card')
    })
  })

  it('removes an item from the cart', () => {
    cy.clearCart()
    cy.getFirstProductId().then((id) => {
      cy.addProductToCart(id)
      cartPage.visit()
      cartPage.getRemoveItemButton(id).click()
      cartPage.getCartItem(id).should('not.exist')
      cartPage.getEmptyCart().should('be.visible')
    })
  })

  it('renders the order summary totals when items are present', () => {
    cy.clearCart()
    cy.getFirstProductId().then((id) => {
      cy.addProductToCart(id)
      cartPage.visit()
      cartPage.getSubtotal().should('be.visible')
      cartPage.getShipping().should('be.visible')
      cartPage.getTax().should('be.visible')
      cartPage.getTotal().should('be.visible')
      cartPage.getFreeShippingThreshold().should('exist')
    })
  })

  it('updates the quantity of an item from the cart', () => {
    cy.clearCart()
    cy.getFirstProductId().then((id) => {
      cy.addProductToCart(id)
      cartPage.visit()
      cartPage.getQuantity(id).should('contain', '1')
      cartPage.getIncreaseQuantityButton(id).click()
      cartPage.getQuantity(id).should('contain', '2')
    })
  })
})
