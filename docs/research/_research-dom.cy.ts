/**
 * TEMPORARY research spec — DOM contract discovery.
 * Dumps real data-testids, dropdown options, cart states and admin headings to
 * cypress/results/research-dom-*.json for offline analysis. DELETE after Phase 2.
 */
describe('RESEARCH — DOM contract', () => {
  before(() => {
    Cypress.on('uncaught:exception', () => false)
  })

  const dumpTestids = (out: Record<string, unknown>, key: string) => {
    cy.get('[data-testid]').then(($els) => {
      out[key] = [...new Set($els.toArray().map((el) => el.getAttribute('data-testid')))]
    })
  }

  const dumpDropdownOptions = (out: Record<string, unknown>, trigger: string, key: string) => {
    cy.getByTestId(trigger)
      .first()
      .click()
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500)
    cy.get('body').then(($body) => {
      out[key] = {
        triggerTag: $body.find(`[data-testid="${trigger}"]`).prop('tagName'),
        triggerRole: $body.find(`[data-testid="${trigger}"]`).attr('role'),
        options: $body
          .find('[role="option"]')
          .toArray()
          .map((o) => o.textContent?.trim()),
      }
    })
    cy.get('body').type('{esc}')
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(300)
  }

  it('products listing — dropdowns, count, pagination', () => {
    const out: Record<string, unknown> = {}
    cy.visit('/products')
    cy.get('[data-testid^="product-card-"]').should('have.length.gte', 1)

    cy.getByTestId('products-count')
      .invoke('text')
      .then((t) => (out.productsCount = t.trim()))
    dumpDropdownOptions(out, 'category-filter', 'categoryDropdown')
    dumpDropdownOptions(out, 'sort-filter', 'sortDropdown')
    cy.getByTestId('pagination-next').then(($n) => {
      out.paginationNext = {
        exists: $n.length > 0,
        visible: $n.is(':visible'),
        disabled: $n.prop('disabled'),
      }
    })
    cy.get('[data-testid^="product-card-"]').then(($c) => {
      out.cardCount = $c.length
      out.firstTwoIds = $c
        .slice(0, 2)
        .toArray()
        .map((el) => (el.getAttribute('data-testid') ?? '').replace('product-card-', ''))
    })
    dumpTestids(out, 'testids')
    cy.writeFile('cypress/results/research-dom-products.json', out)
  })

  it('product detail — testids for first two products', () => {
    const out: Record<string, unknown> = {}
    cy.visit('/products')
    cy.get('[data-testid^="product-card-"]')
      .should('have.length.gte', 1)
      .then(($c) => {
        out.ids = $c
          .slice(0, 2)
          .toArray()
          .map((el) => (el.getAttribute('data-testid') ?? '').replace('product-card-', ''))
      })

    const dumpDetail = (id: string, key: string) =>
      cy.visit(`/products/${id}`).then(() => {
        cy.getByTestId('product-detail').should('be.visible')
        dumpTestids(out, key)
      })

    cy.wrap(null).then(() => {
      const ids = out.ids as string[]
      dumpDetail(ids[0], 'detailTestids_product1')
    })
    cy.wrap(null).then(() => {
      const ids = out.ids as string[]
      dumpDetail(ids[1], 'detailTestids_product2')
    })
    cy.writeFile('cypress/results/research-dom-detail.json', out)
  })

  it('cart — pre-seeded, empty, with item, after purchase', () => {
    const out: Record<string, unknown> = {}
    cy.loginAsCustomer()
    cy.visit('/cart')
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1500)
    dumpTestids(out, 'cartTestids_preseeded')
    cy.writeFile('cypress/results/research-dom-cart.json', out)
    cy.get('body').then(($body) => {
      out.buttons_preseeded = [
        ...new Set(
          $body
            .find('button')
            .toArray()
            .map((b) => b.textContent?.trim()),
        ),
      ].filter(Boolean)
    })

    // Empty the cart via remove buttons if any.
    cy.get('body').then(function clearLoop($body) {
      const btn = $body.find('[data-testid^="cart-remove-item-"]')
      if (btn.length === 0) return
      cy.wrap(btn[0]).click({ force: true })
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(600)
      cy.get('body').then(clearLoop)
    })
    dumpTestids(out, 'cartTestids_empty')
    cy.writeFile('cypress/results/research-dom-cart.json', out)
    cy.get('body').then(($body) => {
      out.buttons_empty = [
        ...new Set(
          $body
            .find('button')
            .toArray()
            .map((b) => b.textContent?.trim()),
        ),
      ].filter(Boolean)
    })

    // Add one product and inspect the with-items state.
    cy.visit('/products')
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2000)
    cy.get('body').then(($body) => {
      const $card = $body.find('[data-testid^="product-card-"]').first()
      out.addedProductId = ($card.attr('data-testid') ?? '').replace('product-card-', '')
      const $btn = $body.find(
        `[data-testid="product-add-to-cart-button-${out.addedProductId}"]`,
      )
      ;($btn[0] as HTMLElement).click()
    })
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2000)
    cy.visit('/cart')
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2000)
    dumpTestids(out, 'cartTestids_withItem')
    cy.writeFile('cypress/results/research-dom-cart.json', out)
    cy.get('body').then(($body) => {
      out.buttons_withItem = [
        ...new Set(
          $body
            .find('button')
            .toArray()
            .map((b) => b.textContent?.trim()),
        ),
      ].filter(Boolean)
    })

    // Click the purchase-looking button and inspect the toast.
    cy.get('body').then(($body) => {
      const $btn = $body
        .find('button')
        .filter(function () {
          return /purchase|checkout/i.test(this.textContent ?? '')
        })
        .first()
      if ($btn.length === 0) {
        out.purchaseButtonFound = false
        return
      }
      out.purchaseButtonFound = true
      out.purchaseButtonText = $btn.text().trim()
      // Native click inside the same then() so React cannot remount mid-command.
      ;($btn[0] as HTMLElement).click()
    })
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(2500)
    cy.get('body').then(($body) => {
      const toasts = $body.find('[data-sonner-toast]')
      out.toastAfterPurchase = {
        count: toasts.length,
        texts: toasts.toArray().map((t) => t.textContent?.trim()),
      }
      out.statusText = $body.find('[role="status"]').toArray().map((t) => t.textContent?.trim())
    })
    dumpTestids(out, 'cartTestids_afterPurchase')
    cy.writeFile('cypress/results/research-dom-cart.json', out)
  })

  it('admin — headings and page text', () => {
    const out: Record<string, unknown> = {}
    cy.loginAsAdmin()
    cy.visit('/admin')
    cy.get('h1').should('contain', 'Admin Dashboard')
    cy.get('h1,h2,h3,h4').then(($els) => {
      out.headings = $els.toArray().map((e) => e.textContent?.trim())
    })
    cy.get('body').then(($b) => {
      out.bodyText = ($b[0] as HTMLBodyElement).innerText?.slice(0, 8000)
    })
    cy.writeFile('cypress/results/research-dom-admin.json', out)
  })
})
