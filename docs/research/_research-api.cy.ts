/**
 * TEMPORARY research spec — API discovery via the /api-test harness.
 * Auth + products sections are open by default; utility/cart/order/scenario
 * sections must be toggled open once. Drives the harness in a realistic order
 * while intercepting /api/** traffic. DELETE after Phase 2.
 */
describe('RESEARCH — API discovery via /api-test', () => {
  before(() => {
    Cypress.on('uncaught:exception', () => false)
  })

  const calls: any[] = []
  const harnessResponses: Record<string, unknown> = {}

  const clickAndCapture = (testid: string, ms = 1500) => {
    cy.get('body').then(($body) => {
      if ($body.find(`[data-testid="${testid}"]`).length === 0) {
        cy.log(`SKIP missing ${testid}`)
        return
      }
      cy.getByTestId(testid)
        .first()
        .click()
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(ms)
      cy.getByTestId('response-output')
        .first()
        .invoke('text')
        .then((text) => {
          harnessResponses[testid] = text.slice(0, 900)
        })
      cy.getByTestId('response-title')
        .first()
        .invoke('text')
        .then((text) => {
          harnessResponses[`${testid}__title`] = text.trim()
        })
    })
  }

  it('drives the harness and records /api traffic', () => {
    cy.intercept('**', (req) => {
      const url = req.url
      if (/\.(js|css|png|jpg|jpeg|svg|woff2?|ico|map|txt|webmanifest)(\?|$)/i.test(url)) return
      const entry: any = { method: req.method, url, requestBody: req.body }
      req.on('response', (res) => {
        entry.status = res?.statusCode
        const body = res?.body
        entry.responseBody = typeof body === 'string' ? body.slice(0, 300) : body
        calls.push(entry)
      })
    })

    cy.visit('/api-test')
    cy.getByTestId('api-test-page').should('be.visible')

    // Open the collapsed sections (auth + products are open by default).
    ;['utility-tests-toggle', 'cart-tests-toggle', 'order-tests-toggle'].forEach((t) => {
      cy.get('body').then(($body) => {
        if ($body.find(`[data-testid="${t}"]`).length > 0) {
          cy.getByTestId(t)
            .first()
            .click()
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.wait(500)
        }
      })
    })

    // Drive the harness in a realistic order, capturing each response.
    clickAndCapture('utility-reset-button', 2000)
    clickAndCapture('auth-login-button', 2000)
    clickAndCapture('auth-get-user-button', 1500)
    clickAndCapture('products-get-all-button', 1500)
    clickAndCapture('products-get-single-button', 1500)
    clickAndCapture('cart-add-button', 2000)
    clickAndCapture('cart-get-button', 1500)
    clickAndCapture('cart-update-button', 1500)
    clickAndCapture('order-create-button', 2500)
    clickAndCapture('order-get-button', 1500)
    clickAndCapture('cart-remove-button', 1500)
    clickAndCapture('cart-clear-button', 1500)
    clickAndCapture('auth-logout-button', 1500)
    clickAndCapture('auth-get-user-button', 1500)

    cy.writeFile('cypress/results/research-api.json', {
      harnessResponses,
      networkCalls: calls,
    })
  })
})
