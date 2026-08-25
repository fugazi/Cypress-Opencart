/// <reference types="cypress" />

/**
 * Global Cypress type augmentations for the custom commands registered in
 * cypress/support/commands.ts and cypress/support/a11y.ts.
 */
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Select an element by its data-testid attribute.
       */
      getByTestId(testId: string): Chainable<JQuery<HTMLElement>>

      /**
       * Log in via the UI by filling the /login form.
       */
      loginViaUI(email: string, password: string): Chainable<void>

      /**
       * Log in via the UI but cache the session with cy.session() so subsequent
       * calls within the same run skip the form.
       */
      loginViaSession(email: string, password: string): Chainable<void>

      /**
       * Log in as the admin demo account (admin@test.com).
       */
      loginAsAdmin(): Chainable<void>

      /**
       * Log in as the customer demo account (user@test.com).
       */
      loginAsCustomer(): Chainable<void>

      /**
       * Open the post-login user menu in the header.
       */
      openUserMenu(): Chainable<void>

      /**
       * Log the current user out via the user menu.
       */
      logout(): Chainable<void>

      /**
       * Add a product to the cart from the products listing.
       */
      addProductToCart(productId: number | string, qty?: number): Chainable<void>

      /**
       * Remove every item from the cart (visit /cart and clear).
       */
      clearCart(): Chainable<void>

      /**
       * Dismiss Vercel toolbar / theme overlays that can intercept clicks.
       */
      dismissOverlays(): Chainable<void>

      /**
       * Resolve the first visible product id on the current listing so specs
       * can target templated testids like `product-card-${id}`.
       */
      getFirstProductId(): Chainable<string>

      /**
       * Inject Axe and run an accessibility check, ignoring Vercel overlays.
       */
      runA11yCheck(context?: string): Chainable<void>
    }
  }
}

export {}
