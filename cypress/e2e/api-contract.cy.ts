import { apiTestPage } from '@pages/ApiTestPage'

/**
 * API contract — migrated from TestProject5/6/7.cy.js.
 *
 * The previous suite tested the ServeRest mock API. This suite exercises the
 * real Music-Tech Shop backend, discovered via the built-in /api-test harness.
 *
 * Strategy: hit /api-test, drive the harness buttons while intercepting the
 * underlying /api/* calls, and assert the contract.
 *
 * ⚠️ SKIPPED (pending runtime endpoint discovery): the actual /api/* paths
 * are not string-literal in the app bundle and need to be observed via
 * network interception before the assertions can be wired correctly. The
 * harness page object (ApiTestPage) and the spec skeleton are in place; the
 * intercept routes (auth/cart/products/orders) must be confirmed against the
 * live backend. See docs/MODERNIZATION-PLAN.md § "Tests en skip (pendientes)".
 */
describe.skip('API contract — Music-Tech Shop backend', () => {
  const apiBaseUrl = 'https://music-tech-shop.vercel.app/api'

  beforeEach(() => {
    apiTestPage.visit()
  })

  context('GET endpoints', () => {
    it('GET /api/products returns a list of products', () => {
      cy.intercept('GET', `${apiBaseUrl}/products**`).as('getProducts')
      apiTestPage.getProductsToggle().click()
      apiTestPage.getProductsGetAllButton().click()
      cy.wait('@getProducts').its('response.statusCode').should('eq', 200)
    })

    it('GET /api/products/:id returns a single product', () => {
      cy.intercept('GET', `${apiBaseUrl}/products/*`).as('getProduct')
      apiTestPage.getProductsToggle().click()
      apiTestPage.getProductsGetSingleButton().click()
      cy.wait('@getProduct').its('response.statusCode').should('eq', 200)
    })
  })

  context('Auth endpoints', () => {
    it('POST /api/auth/login authenticates the demo customer', () => {
      cy.intercept('POST', `${apiBaseUrl}/auth/login`).as('login')
      apiTestPage.getAuthToggle().click()
      apiTestPage.getAuthLoginButton().click()
      cy.wait('@login').its('response.statusCode').should('be.oneOf', [200, 201])
      apiTestPage.getAuthenticatedBadge().should('be.visible')
    })

    it('GET /api/auth/user returns the current user when authenticated', () => {
      // First authenticate, then fetch the user.
      cy.intercept('POST', `${apiBaseUrl}/auth/login`).as('login')
      cy.intercept('GET', `${apiBaseUrl}/auth/user`).as('getUser')
      apiTestPage.getAuthToggle().click()
      apiTestPage.getAuthLoginButton().click()
      cy.wait('@login')
      apiTestPage.getAuthGetUserButton().click()
      cy.wait('@getUser').its('response.statusCode').should('eq', 200)
    })
  })

  context('Cart endpoints', () => {
    it('adds an item to the cart via the API', () => {
      cy.intercept('POST', `${apiBaseUrl}/cart**`).as('cartAdd')
      apiTestPage.getCartToggle().click()
      apiTestPage.getCartAddButton().click()
      cy.wait('@cartAdd').its('response.statusCode').should('be.oneOf', [200, 201])
    })

    it('GET /api/cart returns the current cart', () => {
      cy.intercept('GET', `${apiBaseUrl}/cart**`).as('cartGet')
      apiTestPage.getCartToggle().click()
      apiTestPage.getCartGetButton().click()
      cy.wait('@cartGet').its('response.statusCode').should('eq', 200)
    })
  })

  context('Negative scenarios', () => {
    it('returns an error status when calling a protected route unauthenticated', () => {
      // Log out first to ensure we are unauthenticated, then call /auth/user.
      cy.intercept('GET', `${apiBaseUrl}/auth/user`).as('getUser')
      apiTestPage.getAuthToggle().click()
      apiTestPage
        .getAuthLogoutButton()
        .click()
        .then(() => {
          apiTestPage.getAuthGetUserButton().click()
        })
      cy.wait('@getUser').its('response.statusCode').should('be.oneOf', [401, 403])
    })
  })
})
