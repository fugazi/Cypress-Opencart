import { apiTestPage } from '@pages/ApiTestPage'

/**
 * API contract — via the /api-test harness.
 *
 * Runtime discovery (Modernization V2, Fase 2) showed the app ships NO real
 * HTTP backend: intercepting every request while driving the harness only
 * produces Next.js RSC navigation — no /api/* call ever leaves the browser.
 * The harness simulates the backend client-side and renders each simulated
 * JSON response in the `response-output` card. These tests assert that
 * rendered contract, which is the app's real "API surface".
 *
 * Known harness bug (out of scope): the get-all products button renders
 * `{ "error": "Cannot read properties of undefined (reading 'stringify')" }`.
 */
describe('API contract — mock backend via /api-test', () => {
  beforeEach(() => {
    apiTestPage.visit()
  })

  /** Assert the last harness response contains the given text. */
  const response = (text: string) =>
    apiTestPage.getResponseOutput().first().should('contain.text', text)

  context('Utility', () => {
    it('resets carts, orders and sessions', () => {
      apiTestPage.clickSectionButton('utility-tests-toggle', 'utility-reset-button')
      response('clearedData')
      response('carts')
      response('sessions')
    })
  })

  context('Auth', () => {
    it('logs in the demo customer and returns a mock token', () => {
      apiTestPage.clickSectionButton('auth-tests-toggle', 'auth-login-button')
      response('user@test.com')
      response('mock_jwt')
      response('customer')
      apiTestPage.getAuthenticatedBadge().should('be.visible')
    })

    it('returns the current user', () => {
      apiTestPage.clickSectionButton('auth-tests-toggle', 'auth-login-button')
      apiTestPage.clickSectionButton('auth-tests-toggle', 'auth-get-user-button')
      response('Test User')
      response('role')
    })
  })

  context('Products', () => {
    it('returns a single product with the full contract', () => {
      apiTestPage.clickSectionButton('product-tests-toggle', 'products-get-single-button')
      response('Premium Wireless Headphones')
      response('299.99')
      response('category')
    })
  })

  context('Cart', () => {
    // The mock cart keys off the configured demo email — log in first.
    beforeEach(() => {
      apiTestPage.clickSectionButton('auth-tests-toggle', 'auth-login-button')
    })

    it('adds an item and returns its subtotal', () => {
      apiTestPage.clickSectionButton('cart-tests-toggle', 'cart-add-button')
      response('cart_user@test.com')
      response('subtotal')
      response('added to cart')
    })

    it('returns the current cart with items and total', () => {
      apiTestPage.clickSectionButton('cart-tests-toggle', 'cart-add-button')
      apiTestPage.clickSectionButton('cart-tests-toggle', 'cart-get-button')
      response('items')
      response('total')
    })

    it('clears the cart', () => {
      apiTestPage.clickSectionButton('cart-tests-toggle', 'cart-clear-button')
      response('cart_user@test.com')
      response('cleared successfully')
    })
  })
})
