# Cypress E2E — Music-Tech Shop

End-to-end test suite for the **[Music-Tech Shop](https://music-tech-shop.vercel.app)** storefront, built with **Cypress 15 + TypeScript** and the **Page Object Model** pattern.

> This project was modernized from a legacy JavaScript/OpenCart suite. The full
> migration history and rationale live in [`docs/MODERNIZATION-PLAN.md`](docs/MODERNIZATION-PLAN.md).

---

## ✨ Highlights

- **TypeScript** end-to-end (specs, page objects, commands, config).
- **Page Object Model** with `BasePage` + 10 page objects.
- **`data-testid`-first selectors** — the app exposes stable testids on every interactive element.
- **Custom commands**: `cy.loginAsCustomer()`, `cy.loginAsAdmin()`, `cy.clearCart()`, `cy.getByTestId()`, …
- **Accessibility checks** via `cypress-axe-core` (`cy.runA11yCheck()`).
- **HTML reports** via `cypress-mochawesome-reporter` (charts + embedded screenshots).
- **ESLint + Prettier** for consistent code quality.

---

## 🏠 Application under test

| Property              | Value                                                         |
| --------------------- | ------------------------------------------------------------- |
| URL                   | `https://music-tech-shop.vercel.app`                          |
| Stack                 | Next.js (App Router) + React + Tailwind + shadcn/ui on Vercel |
| Admin demo account    | `admin@test.com` / `admin123`                                 |
| Customer demo account | `user@test.com` / `user123`                                   |

The app has **no public registration** and **no `/checkout` route** (checkout is a client-side action from `/cart`).

---

## ✅ Pre-requisites

- **Node.js ≥ 20** — [download](https://nodejs.org/)
- **npm** (bundled with Node)
- **git** — [download](https://git-scm.com/)

---

## 🚀 Getting started

```bash
# 1. Clone
git clone https://github.com/fugazi/Cypress-Opencart.git
cd Cypress-Opencart

# 2. Install dependencies
npm install

# 3. (Optional) Create a local env file from the template
cp cypress.env.example.json cypress.env.json
#    The defaults in cypress.config.ts already point at the live app, so this
#    is only needed to override credentials/baseUrl.

# 4. Open the interactive runner
npm run cy:open
```

---

## 🧰 Scripts

| Script                   | Description                              |
| ------------------------ | ---------------------------------------- |
| `npm run cy:open`        | Open the Cypress interactive runner.     |
| `npm run cy:run`         | Run the whole suite headless (Electron). |
| `npm run cy:run:chrome`  | Run the suite in headless Chrome.        |
| `npm run cy:run:firefox` | Run the suite in headless Firefox.       |
| `npm run cy:run:edge`    | Run the suite in headless Edge.          |
| `npm run lint`           | Lint `cypress/**/*.ts` with ESLint.      |
| `npm run lint:fix`       | Lint and auto-fix.                       |
| `npm run format`         | Format with Prettier.                    |
| `npm run format:check`   | Check formatting without writing.        |
| `npm run report:clean`   | Delete the Mochawesome report output.    |

---

## 📁 Project structure

```
Cypress-Opencart/
├── cypress/
│   ├── e2e/                 # 14 TypeScript specs (.cy.ts)
│   ├── fixtures/            # users.json, products.json, cart-items.json
│   ├── pages/               # Page Object Model (BasePage + 10 pages)
│   ├── support/             # commands.ts, e2e.ts, a11y.ts, types.ts
│   ├── types/               # index.d.ts (Cypress augmentations)
│   └── report/              # Mochawesome output (gitignored)
├── docs/
│   └── MODERNIZATION-PLAN.md
├── cypress.config.ts
├── tsconfig.json
├── eslint.config.js
├── .prettierrc.json
└── package.json
```

---

## 🧪 Test suite

**Summary: 33 enabled tests (all passing), 38 skipped (documented as pending).**

| Spec                     | Coverage                                               | Status                                  |
| ------------------------ | ------------------------------------------------------ | --------------------------------------- |
| `homepage.cy.ts`         | Header, footer, navigation, SEO meta tags.             | ✅ 5/5                                  |
| `navigation.cy.ts`       | Repeated routing across pages (stability).             | ✅ 3/3                                  |
| `auth-login.cy.ts`       | Login form, quick-fill, validation, continue-as-guest. | ✅ 7/7                                  |
| `auth-logout.cy.ts`      | Logout via user menu.                                  | ✅ 2/2                                  |
| `search.cy.ts`           | Header + listing search, no-results state.             | ✅ 3/3                                  |
| `wishlist.cy.ts`         | Wishlist render, empty state, browse-products.         | ✅ 3/3                                  |
| `dashboard.cy.ts`        | Customer dashboard sections.                           | ✅ 8/8                                  |
| `cart.cy.ts`             | Add/remove/clear, order summary totals.                | ⚠️ 1/4 (cart state pending)             |
| `admin.cy.ts`            | Admin metrics/sections (via `cy.contains`).            | ⚠️ 1/7 (labels pending)                 |
| `products-catalog.cy.ts` | Listing, filters, sort, pagination, empty state.       | ⚠️ skipped (pending option values)      |
| `product-detail.cy.ts`   | Gallery, quantity, totals, specs, reviews, share.      | ⚠️ skipped (pending DOM contract)       |
| `accessibility.cy.ts`    | axe-core checks on main flows.                         | ⚠️ skipped (pending a11y tuning)        |
| `api-contract.cy.ts`     | Backend API via `/api-test` harness.                   | ⚠️ skipped (pending endpoint discovery) |
| `checkout.cy.ts`         | "Complete Purchase" toast flow (no `/checkout` route). | ⚠️ skipped (pending cart state)         |

> The skipped specs reflect the real state of the demo application under test
> (pre-seeded cart, axe violations in the app, undiscovered API endpoints,
> dynamic option values, product-specific testids) rather than bugs in the
> test harness. See [`docs/MODERNIZATION-PLAN.md`](docs/MODERNIZATION-PLAN.md)
> § "Tests en skip (pendientes)" for the full rationale and re-enable plan.

---

## 🧱 Adding a new test

1. **Add selectors to the page object** in `cypress/pages/<Page>.ts` (use `data-testid`).
2. **Add fixtures** under `cypress/fixtures/` and type them in `cypress/support/types.ts`.
3. **Create the spec** in `cypress/e2e/<feature>.cy.ts` and import the page object via the `@pages/*` alias.
4. **Run** `npm run cy:open` to iterate, then `npm run lint` before committing.

### Conventions

- Prefer `cy.getByTestId('…')` over CSS classes or `:nth-child` chains.
- Reuse `cy.loginAsCustomer()` / `cy.loginAsAdmin()` — they cache the session with `cy.session()`.
- Use `cy.dismissOverlays()` (called automatically in `beforeEach`) if Vercel toolbars get in the way.
- Wrap axe checks with `cy.runA11yCheck([optionalCssScope])`.

---

## 📊 Reports

After every `cy:run*`, an HTML report is generated at `cypress/report/index.html`. Clean it with `npm run report:clean`.

---

## 👤 Author

**Douglas Urrea Ocampo** — Colombia 🇨🇴

- LinkedIn: [douglasfugazi](https://www.linkedin.com/in/douglasfugazi)
- Website: [douglasfugazi.co](https://douglasfugazi.co)

## 📄 License

MIT — see [LICENSE](LICENSE).
