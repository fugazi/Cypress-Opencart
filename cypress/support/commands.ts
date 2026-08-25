// ***********************************************************
// Custom Cypress commands for the Music-Tech Shop suite.
// Type augmentations live in cypress/types/index.d.ts.
// ***********************************************************

/**
 * Select an element by its data-testid attribute.
 *
 * The Music-Tech Shop app exposes stable testids on every interactive
 * element; this is the canonical selector strategy across the suite.
 */
Cypress.Commands.add('getByTestId', (testId: string) => cy.get(`[data-testid="${testId}"]`))

/**
 * Dismiss transient overlays that can intercept clicks:
 *  - Vercel toolbar (aria-label contains "Notifications")
 *  - Toast containers left over from previous tests
 *
 * Always called in the global beforeEach from e2e.ts.
 */
Cypress.Commands.add('dismissOverlays', () => {
  cy.get('body').then(($body) => {
    $body.find('[aria-label*="Notifications"]').each((_, el) => {
      Cypress.$(el).remove()
    })
    // Toast containers (shadcn/ui uses [data-sonner-toast] / role="status").
    $body.find('[role="status"], [data-sonner-toaster]').remove()
  })
})

/**
 * Log in via the /login UI by filling the form fields.
 */
Cypress.Commands.add('loginViaUI', (email: string, password: string) => {
  cy.visit('/login')
  cy.getByTestId('login-email-input').clear().type(email)
  cy.getByTestId('login-password-input').clear().type(password)
  cy.getByTestId('login-submit-button').click()

  // The user menu button only appears in the header once authenticated.
  cy.getByTestId('user-menu-button').should('be.visible')
})

/**
 * Log in via the UI but cache the session across tests using cy.session().
 * Subsequent calls with the same id replay the cached session cookies.
 *
 * After restoring the session we visit "/" so the header (with the user menu)
 * is rendered — cy.session() only restores cookies, not the page DOM.
 */
Cypress.Commands.add('loginViaSession', (email: string, password: string) => {
  const sessionId = `user-${email.replace(/[^a-z0-9]/gi, '-')}`
  cy.session(
    sessionId,
    () => {
      cy.loginViaUI(email, password)
    },
    {
      validate: () => {
        cy.visit('/')
        cy.getByTestId('user-menu-button').should('be.visible')
      },
    },
  )
  // Ensure the page is loaded after session restore for the calling spec.
  cy.visit('/')
  cy.getByTestId('user-menu-button').should('be.visible')
})

/**
 * Log in as the admin demo account.
 */
Cypress.Commands.add('loginAsAdmin', () => {
  cy.loginViaSession(
    Cypress.expose('adminEmail') as string,
    Cypress.expose('adminPassword') as string,
  )
})

/**
 * Log in as the customer demo account.
 */
Cypress.Commands.add('loginAsCustomer', () => {
  cy.loginViaSession(
    Cypress.expose('customerEmail') as string,
    Cypress.expose('customerPassword') as string,
  )
})

/**
 * Open the post-login user menu in the header.
 */
Cypress.Commands.add('openUserMenu', () => {
  cy.getByTestId('user-menu-button').should('be.visible').click()
  cy.getByTestId('user-menu-dropdown').should('be.visible')
})

/**
 * Log out via the user menu.
 */
Cypress.Commands.add('logout', () => {
  cy.openUserMenu()
  cy.getByTestId('logout-button').click()
  // After logout the login link reappears in the header.
  cy.getByTestId('login-button').should('be.visible')
})

/**
 * Add a product to the cart. For qty > 1, route through the detail page
 * (quantity selectors only exist there).
 */
Cypress.Commands.add('addProductToCart', (productId, qty = 1) => {
  if (qty === 1) {
    cy.visit('/products')
    // Visibility assertion first: the app hydrates client-side and can remount
    // the grid right after the visit.
    cy.getByTestId(`product-add-to-cart-button-${productId}`).should('be.visible').click()
    return
  }
  cy.visit(`/products/${productId}`)
  cy.getByTestId('quantity-display')
    .invoke('text')
    .then((text) => {
      const current = parseInt(text.trim(), 10) || 1
      const needed = qty - current
      for (let i = 0; i < needed; i += 1) {
        cy.getByTestId('quantity-increase-button').click()
      }
    })
  cy.getByTestId('add-to-cart-button').should('be.visible').click()
})

/**
 * Remove every item from the cart until the empty state is shown.
 *
 * The cart is client-side state: each removal is confirmed by asserting the
 * item row disappears before the next one is clicked — no fixed waits needed.
 */
Cypress.Commands.add('clearCart', () => {
  cy.visit('/cart')
  const removeAll = (): void => {
    cy.get('body').then(($body) => {
      const $btn = $body.find('[data-testid^="cart-remove-item-"]').first()
      if ($btn.length === 0) return
      const id = ($btn.attr('data-testid') ?? '').replace('cart-remove-item-', '')
      cy.getByTestId(`cart-remove-item-${id}`).first().click()
      cy.getByTestId(`cart-item-${id}`).should('not.exist')
      removeAll()
    })
  }
  removeAll()
})

/**
 * Resolve the first visible product id on the products listing so specs can
 * target templated testids like product-card-${id}.
 */
Cypress.Commands.add('getFirstProductId', () => {
  cy.visit('/products')
  return cy
    .get('[data-testid^="product-card-"]')
    .first()
    .invoke('attr', 'data-testid')
    .then((testId) => (testId ?? '').replace('product-card-', ''))
})
