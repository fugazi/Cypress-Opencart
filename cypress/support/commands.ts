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
 * Click an element by testid through its live DOM node.
 *
 * Three app behaviours make a framework-managed cy.click() unreliable here:
 *
 * 1. Selective hydration: dispatching a click on a not-yet-hydrated subtree
 *    makes React replace that subtree's nodes as a result of the click itself,
 *    so cy.click() loses the element while waiting for it to become actionable
 *    ("page updated while this command was executing").
 * 2. Sync navigation: handlers like the login submit navigate immediately, so
 *    cy.click()'s post-dispatch checks chase an already-navigating page.
 * 3. Duplicated subtrees: the detail page keeps an invisible (0x0) copy of the
 *    quantity/add-to-cart block outside <main>, and the listing animates cards
 *    in with opacity-0 until they enter the viewport.
 *
 * This command therefore: resolves the instance that actually has a layout
 * box (dropping ghost copies), scrolls it into view (triggering the reveal
 * animation), waits for Cypress visibility + React hydration (the fiber/props
 * expando keys only exist on hydrated nodes — SSR markup is inert), then
 * dispatches the click on the live DOM node. Only use for plain onClick
 * handlers; Radix primitives (menus, comboboxes) need real pointer events and
 * must keep cy.click().
 */
Cypress.Commands.add('clickTestId', (testId: string, scope = '') => {
  const selector = scope ? `${scope} [data-testid="${testId}"]` : `[data-testid="${testId}"]`
  const hasLayoutBox = (el: HTMLElement): boolean =>
    el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0

  // Resolve the instance that actually has a layout box (the detail page keeps
  // a 0x0 ghost copy of the interactive block outside <main>).
  cy.get(selector)
    .should(($els) => {
      expect(
        $els.toArray().filter(hasLayoutBox).length,
        `a rendered instance of ${testId}`,
      ).to.be.greaterThan(0)
    })
    .then(($els) => cy.wrap($els.toArray().filter(hasLayoutBox)[0]))
    // Reveal-on-scroll: the listing animates cards in with opacity-0 until
    // they enter the viewport — scrolling is what triggers the animation, so
    // it must happen BEFORE the visibility assertion.
    .scrollIntoView()
    .should('be.visible')
    .and(($el) => {
      const keys = Object.keys($el[0] as unknown as Record<string, unknown>)
      expect(
        keys.some((k) => k.startsWith('__reactFiber$') || k.startsWith('__reactProps$')),
        'target is React-hydrated',
      ).to.equal(true)
    })
  cy.document().then((doc) => {
    const el = Array.from(doc.querySelectorAll<HTMLElement>(selector)).find(hasLayoutBox)
    if (!el) throw new Error(`[data-testid="${testId}"] disappeared before the click`)
    el.click()
  })
})

/**
 * Log in via the /login UI by filling the form fields.
 *
 * The submit button is clicked via clickTestId(): the app navigates
 * synchronously from the submit handler, so cy.click() keeps losing the button
 * to its own success navigation.
 */
Cypress.Commands.add('loginViaUI', (email: string, password: string) => {
  cy.visit('/login')
  cy.getByTestId('login-email-input').clear().type(email)
  cy.getByTestId('login-password-input').clear().type(password)
  cy.clickTestId('login-submit-button')

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
 * Wait for the /products listing to settle after hydration.
 *
 * The listing is fully client-rendered: the grid briefly renders a pre-sort /
 * pre-pagination state (id order) before React applies the name sort and the
 * pagination slice. The result count ("Showing 16 of 50 products (Page 1 of
 * 4)") only renders once that client state exists, so its presence is the
 * deterministic settle signal — reading cards or clicking card buttons before
 * it resolves targets the transient layout.
 */
Cypress.Commands.add('waitForProductsSettled', () => {
  cy.getByTestId('products-count').should('contain.text', 'Page')
})

/**
 * Add a product to the cart. For qty > 1, route through the detail page
 * (quantity selectors only exist there).
 */
Cypress.Commands.add('addProductToCart', (productId, qty = 1) => {
  if (qty === 1) {
    cy.visit('/products')
    cy.waitForProductsSettled()
    cy.clickTestId(`product-add-to-cart-button-${productId}`)
    return
  }
  cy.visit(`/products/${productId}`)
  cy.getByTestId('quantity-display')
    .invoke('text')
    .then((text) => {
      const current = parseInt(text.trim(), 10) || 1
      const needed = qty - current
      for (let i = 0; i < needed; i += 1) {
        cy.clickTestId('quantity-increase-button')
      }
    })
  cy.clickTestId('add-to-cart-button')
})

/**
 * Remove every item from the cart until the empty state is shown.
 *
 * The cart is client-side state: each removal is confirmed by asserting the
 * item row disappears before the next one is clicked — no fixed waits needed.
 */
Cypress.Commands.add('clearCart', () => {
  cy.visit('/cart')
  // The whole cart section is client-rendered; wait for either state before
  // looking for remove buttons.
  cy.get('[data-testid="order-summary-card"], [data-testid="empty-cart"]').should('exist')
  const removeAll = (): void => {
    cy.get('body').then(($body) => {
      const $btn = $body.find('[data-testid^="cart-remove-item-"]').first()
      if ($btn.length === 0) return
      const id = ($btn.attr('data-testid') ?? '').replace('cart-remove-item-', '')
      cy.clickTestId(`cart-remove-item-${id}`)
      cy.getByTestId(`cart-item-${id}`).should('not.exist')
      removeAll()
    })
  }
  removeAll()
})

/**
 * Resolve a product id whose add-to-cart button is actually rendered.
 *
 * The id is read from the add-to-cart buttons themselves instead of from the
 * first card: during hydration the grid briefly shows a pre-sort layout, so
 * "first card" can return a product whose button is not on the settled page.
 */
Cypress.Commands.add('getFirstProductId', () => {
  cy.visit('/products')
  cy.waitForProductsSettled()
  return cy
    .get('[data-testid^="product-add-to-cart-button-"]')
    .first()
    .invoke('attr', 'data-testid')
    .then((testId) => (testId ?? '').replace('product-add-to-cart-button-', ''))
})
