# Plan de Modernización V2 — Cypress E2E → Music-Tech Shop

> **Documento del segundo ciclo de modernización del framework.**
>
> El primer ciclo (JavaScript → TypeScript, POM, ESLint/Prettier, custom commands,
> a11y, reportes Mochawesome) se ejecutó **completo** y su historia vive en
> [`MODERNIZATION-PLAN.md`](MODERNIZATION-PLAN.md). Este plan cubre la deuda que
> quedó tras esa ejecución: tests skipeados, dependencias atrasadas e higiene del
> tooling.
>
> Estado: **en ejecución** — Fase 1 completada (agosto 2026). Las fases se
> ejecutan en orden.

---

## Tabla de contenidos

1. [Objetivo y alcance](#1-objetivo-y-alcance)
2. [Decisiones tomadas](#2-decisiones-tomadas)
3. [Diagnóstico del estado actual](#3-diagnóstico-del-estado-actual)
4. [Análisis de dependencias](#4-análisis-de-dependencias)
5. [Fases de implementación](#5-fases-de-implementación)
   - [Fase 1 — Higiene de dependencias y tooling](#fase-1--higiene-de-dependencias-y-tooling)
   - [Fase 2 — Reactivación de los 38 tests skipeados](#fase-2--reactivación-de-los-38-tests-skipeados)
   - [Fase 3 — Actualizaciones mayores de dependencias](#fase-3--actualizaciones-mayores-de-dependencias)
   - [Fase 4 — Endurecimiento (opcional)](#fase-4--endurecimiento-opcional)
6. [Riesgos y mitigaciones](#6-riesgos-y-mitigaciones)
7. [Criterios de aceptación](#7-criterios-de-aceptación)
8. [Cronograma estimado](#8-cronograma-estimado)

---

## 1. Objetivo y alcance

### Objetivo principal

1. **Reactivar la suite skipeada**: 38 de 71 tests (54%) están en `it.skip` /
   `describe.skip` en 7 specs, con causa y acción de reactivación ya documentadas
   en [MODERNIZATION-PLAN.md §11](MODERNIZATION-PLAN.md#11-tests-en-skip-pendientes).
2. **Actualizar dependencias** atrasadas, incluidas 4 actualizaciones mayores.
3. **Higiene del tooling**: dependencias sin uso, script de lint con flag
   deprecado, anti-patrones puntuales en commands, fixture sin uso.
4. **Endurecimiento opcional** (backlog): quality gates locales, enforcement de
   selectores, matrix de viewports.

### Fuera de alcance (por decisión explícita)

- **CI/CD con GitHub Actions**: este es un proyecto de pruebas y montar CI
  generaría consumo de máquina innecesario. **Toda la validación es 100% local**
  (ver [§2](#2-decisiones-tomadas)).
- **TypeScript 7** (5.9 → 7.0): TS 7 es el port nativo en Go; Cypress aún no
  declara soporte oficial. Se permanece en 5.9.x y se reevalúa cuando Cypress lo
  oficialice.

---

## 2. Decisiones tomadas

| # | Decisión | Justificación |
| --- | --- | --- |
| 1 | **Sin CI/CD** — validación exclusivamente local | Proyecto de pruebas; evitar consumo de máquina. Disciplina local: `lint` + `tsc --noEmit` + run de specs base antes de cada commit. `husky` + `lint-staged` (Fase 4) automatizan ese gate. |
| 2 | **Desinstalar `@faker-js/faker`** | 0 referencias en el código. La app no tiene registro público y el login usa cuentas demo fijas; no hay caso de uso para datos aleatorios. |
| 3 | **Permanecer en TypeScript 5.9.x** | TS 7 (port nativo) sin soporte declarado por Cypress; saltar arriesga romper `tsc --noEmit` y el runner. Excepción documentada. |
| 4 | **Renumerar fases sin huecos** | La propuesta original tenía una fase de CI que se eliminó; este documento queda con 4 fases correlativas. |
| 5 | **Validación de saltos mayores por commit local** | Cada actualización mayor se valida y commitea por separado para poder revertir sin romper el resto. |

---

## 3. Diagnóstico del estado actual

### 3.1 Fortalezas (no se tocan)

- Cypress 15.18 + TypeScript 5.9 **strict** (`tsc --noEmit` pasa limpio).
- POM real: `BasePage` + 10 page objects; selectores `data-testid` canónicos.
- Custom commands con `cy.session()` para auth cacheada.
- ESLint 9 flat config + Prettier 3 (`npm run lint` pasa limpio).
- Reportes HTML Mochawesome con screenshots embebidos.
- README y docs alineados con el estado real.

### 3.2 Deuda encontrada

| # | Hallazgo | Evidencia |
| --- | --- | --- |
| 1 | **38/71 tests skipeados (54%)** en 7 specs | `accessibility` (5), `api-contract` (7), `admin` (6/7), `cart` (3/4), `checkout` (2), `products-catalog` (7), `product-detail` (8) |
| 2 | **4 actualizaciones mayores atrasadas** | `eslint` 9→10, `eslint-plugin-cypress` 3→7, `cypress-mochawesome-reporter` 3→5, `eslint-config-prettier` 9→10 (ver [§4](#4-análisis-de-dependencias)) |
| 3 | **Dependencias sin uso** | `@faker-js/faker` (0 referencias); fixture `cart-items.json` (0 referencias) |
| 4 | **Tooling con fricción** | `@typescript-eslint/eslint-plugin` + `parser` redundantes (ya existe el umbrella `typescript-eslint`); script `lint` usa `--ext .ts` (no aplica en flat config, se elimina en ESLint 10); `runA11yCheck` tipado en `a11y.ts` en vez de `cypress/types/index.d.ts`; reportes acumulados (`index_001…020`) por `overwrite: false` |
| 5 | **Anti-patrón en `clearCart()`** | `cy.wait(200)` hardcodeado + `click({ force: true })` + recursión manual (`commands.ts:140-154`) — único anti-patrón real del código |

---

## 4. Análisis de dependencias

Salida de `npm outdated` (agosto 2026):

### 4.1 Menores / patch (Fase 1, riesgo bajo)

| Paquete | Actual | Objetivo |
| --- | --- | --- |
| `cypress` | 15.18.0 | 15.21.1 |
| `axe-core` | 4.12.1 | 4.13.0 |
| `@typescript-eslint` | 8.62.1 | 8.68.0 |
| `prettier` | 3.9.4 | 3.9.6 |
| `@types/node` | 22.20.0 | 22.20.1 (alineado a Node 22 LTS; el Node local es v24.13.0) |

### 4.2 Mayores (Fase 3, con validación por salto)

| Paquete | Salto | Riesgo / nota |
| --- | --- | --- |
| `eslint` | 9.39 → 10.9 | Junto con `eslint-plugin-cypress`; `--ext` ya removido en la Fase 1 |
| `eslint-plugin-cypress` | 3.6 → 7.0 | Salto de 4 majors: revisar reglas renombradas/eliminadas en `eslint.config.js` |
| `eslint-config-prettier` | 9.1 → 10.1 | Trivial, actualizar junto con ESLint 10 |
| `cypress-mochawesome-reporter` | 3.8 → 5.0 | Revisar breaking changes de `reporterOptions` y del `register` |

### 4.3 Excluidas

| Paquete | Motivo |
| --- | --- |
| `typescript` (5.9 → 7.0) | Port nativo en Go sin soporte declarado por Cypress. Reevaluar cuando Cypress lo oficialice. |

### 4.4 Eliminadas

| Paquete | Motivo |
| --- | --- |
| `@faker-js/faker` | Sin uso (0 referencias). |
| `@typescript-eslint/eslint-plugin` | Redundante: el umbrella `typescript-eslint` ya provee parser + plugin. |
| `@typescript-eslint/parser` | Ídem. |

---

## 5. Fases de implementación

### Fase 1 — Higiene de dependencias y tooling

**Objetivo:** eliminar fricción y dependencias muertas. Riesgo bajo, ~½ día.

**Tareas:**

- [x] Actualizar menores seguras ([§4.1](#41-menores--patch-fase-1-riesgo-bajo)).
- [x] Desinstalar `@faker-js/faker`.
- [x] Desinstalar `@typescript-eslint/eslint-plugin` y `@typescript-eslint/parser`.
- [x] Quitar `--ext .ts` de los scripts `lint` y `lint:fix` (flat config no lo necesita).
- [x] Mover la declaración de tipos de `runA11yCheck` de `a11y.ts` a `cypress/types/index.d.ts` (consistencia con el resto de commands).
- [x] `overwrite: true` en `reporterOptions` (evita la acumulación `index_001…020`).
- [x] Decisión sobre `fixtures/cart-items.json`: **se conserva** — la Fase 2 lo
  validará/reescribirá contra el contrato real de `/cart` al reactivar los tests
  de carrito; si al cerrar esa fase sigue sin uso, se elimina.

**Validación local:** `npm run lint` + `npx tsc --noEmit` + `npm run cy:run` de los specs base (`homepage`, `auth-login`).

**Ejecución (agosto 2026):** versiones instaladas — `cypress` 15.21.1, `axe-core`
4.13.0, `typescript-eslint` 8.68.0, `prettier` 3.9.6, `@types/node` 22.20.1.
Validación: lint y `tsc --noEmit` limpios; specs base **12/12 en verde**
(homepage 5/5, auth-login 7/7); reporte HTML regenerado como `index.html` único
tras limpiar los 20+ reportes acumulados.

---

### Fase 2 — Reactivación de los 38 tests skipeados

**Objetivo:** pasar de 33/71 a ≥65/71 tests habilitados. Es el corazón del plan:
~2–4 días. Las acciones por spec están documentadas en
[MODERNIZATION-PLAN.md §11](MODERNIZATION-PLAN.md#11-tests-en-skip-pendientes);
aquí se ordenan **por dependencia técnica**:

| Paso | Trabajo | Habilita | Tests |
| --- | --- | --- | --- |
| 1 | **Descubrimiento de la API** vía `/api-test` + `cy.intercept('GET/POST', '/api/**')` para capturar rutas y payloads reales; documentarlos en fixtures | `api-contract` | 7 |
| 2 | **Limpieza de carrito vía API** con los endpoints descubiertos → reescribir `clearCart()` sin `cy.wait(200)` ni `force: true` ni recursión manual | (soporte) | — |
| 3 | **Contrato DOM de `/cart`** autenticado: confirmar testids del estado con items y vacío; alinear `CartPage` y asserts | `cart` + `checkout` | 3 + 2 |
| 4 | **Valores reales de los selects** `category-filter` / `sort-filter`; actualizar `fixtures/products.json` | `products-catalog` | 7 |
| 5 | **Asserts tolerantes a secciones opcionales** (`gallery-thumbnails`, `specifications-list`, `share-*`, `featured-products-section`) según el DOM real por producto | `product-detail` | 8 |
| 6 | **Headings reales del panel `/admin`** autenticado; actualizar `AdminPage` | `admin` | 6 |
| 7 | **Afinar `exclude` de axe** (toolbar Vercel, toasts) y definir threshold de severidad | `accessibility` | 5 |

**Validación local:** cada spec reactivado corre en verde (con los `retries: runMode: 2`
existentes) antes de pasar al siguiente. La suite completa debe quedar en verde
al final de la fase.

### Ejecución Fase 2 — CHECKPOINT (25/08/2026, trabajo en progreso)

#### Hallazgos de la investigación en runtime (artefactos en `docs/research/`)

1. **No existe backend HTTP real.** Interceptando TODO el tráfico mientras se
   conduce el harness `/api-test`, jamás sale una llamada `/api/*` del browser —
   solo navegación RSC de Next.js (`?_rsc=`). El harness **simula** la API
   client-side y pinta cada respuesta JSON simulada en `response-output`.
   → `api-contract.cy.ts` se reorientó a assertar el contrato simulado que el
   harness renderiza (que es la "superficie de API" real de la app).
2. **Los filtros de `/products` no son `<select>` nativos**: son comboboxes de
   shadcn/ui (BUTTON `role=combobox` + opciones en portal). Por eso fallaban
   los `.select()`. Selección real: click al trigger + click a
   `[role="option"]`. Categorías reales: All, Electronics, Photography,
   Accessories, Synthesizers, Studio Recording. Sort real: "Name (A-Z)",
   "Name (Z-A)", "Price (Low to High)", "Price (High to Low)".
3. **Contrato del carrito**: items `cart-item-${id}` con controles de cantidad
   por item (`cart-increase/decrease-quantity-${id}`), totals
   `cart-subtotal/shipping/tax/total`, `free-shipping-threshold` (sin
   `-label`), y `checkout-button` solo existe con items. El estado vacío
   muestra `empty-cart`. Todo el estado del carrito es client-side.
4. **Checkout**: "Complete Purchase" NO muestra toast — vacía el carrito y
   navega al home. El contrato observable de éxito = salida de `/cart` +
   `empty-cart` al volver.
5. **Product detail**: `gallery-thumbnails` no existe (solo imagen principal);
   el botón de compartir enlace es `copy-link-button` (no `share-link-button`).
   Specs/share/reviews/featured sí existen en todos los productos.
6. **Admin**: headings reales = `Admin Dashboard` (h1), `Key Metrics`,
   `Order Status`, `Analytics`. `Revenue Overview`, `Sales by Category`,
   `Top Selling Products`, `Recent Activity` son labels de sección, no
   headings → `assertSection` ahora matchea cualquier elemento.
7. Bug del harness documentado: `products-get-all` renderiza
   `{ "error": "Cannot read properties of undefined (reading 'stringify')" }`.

#### Estado por paso

| Paso | Estado | Resultado de tests |
| --- | --- | --- |
| 1 — Contrato harness → `api-contract` | ✅ Reescrito y en verde | **7/7** |
| 2 — `clearCart()` sin `cy.wait`/`force`/recursión manual | ✅ Reescrito (loop con aserciones) | — |
| 3a — `checkout` | ✅ Reescrito y en verde | **2/2** |
| 3b — `cart` | ⚠️ Reescrito (5 tests), **0/5 — diagnóstico pendiente** | 0/5 |
| 4 — `products-catalog` | ⚠️ Reescrito (7 tests, dropdowns custom + fixture real) | **5/7** |
| 5 — `product-detail` | ⚠️ Reescrito (8 tests, selectores corregidos) | **6/8** |
| 6 — `admin` | ✅ Reescrito y en verde | **7/7** |
| 7 — `accessibility` (a11y) | ⏳ Sin empezar | — |

Avance neto: **de 33/71 habilitados → 60 habilitados; 51 en verde** en la
última corrida parcial (api-contract 7 + checkout 2 + admin 7 + catalog 5 +
detail 6 + los 31 previos que seguían en verde menos cart que pasó de 1 a 0
temporalmente).

#### Pendiente para retomar

1. **Diagnosticar `cart.cy.ts` (0/5)**: todos fallan con
   `cy.click() failed because the page updated while this command was
   executing` — incluso el primer test (que apenas usa `loginAsCustomer` en el
   `beforeEach`). Sospecha: race de hidratación en el click de
   `login-submit-button` dentro de `cy.session()` (checkout pasó con el mismo
   comando, así que es timing/flaky, no lógica). Líneas a atacar:
   `loginViaUI` en `cypress/support/commands.ts` (blindar el click del submit,
   p. ej. aserción de visibilidad + reintento) y/o el click de
   add-to-cart en `addProductToCart`.
2. **Diagnosticar los 2 fallos de `products-catalog`** (5/7) — identificar
   cuáles tests fallan (correr el spec solo y leer el error).
3. **Diagnosticar los 2 fallos de `product-detail`** (6/8) — ídem.
4. **Paso 7 a11y**: escribir research de violaciones con `checkA11y` +
   `skipFailures`/`violationsCb` (la API v2 de `cypress-axe-core` lo permite),
   tunear `exclude` + `shouldFailFn` por severidad (critical/serious), y
   corregir el helper `runA11yCheck` a la firma real
   `cy.checkA11y(context, options)` (la firma actual con objeto único cast
   `as never` nunca se validó porque el spec estuvo skipeado).
5. Suite completa en verde → actualizar contadores del README → lint/tsc →
   commit final de la fase.

> Los specs de investigación temporales (`_research-*.cy.ts`) se movieron a
> `docs/research/` (fuera del `specPattern`) junto con los JSON de hallazgos
> (`research-*.json`). No se ejecutan con la suite; se conservan como
> referencia y se pueden borrar al cerrar la fase.

---

### Fase 3 — Actualizaciones mayores de dependencias

**Objetivo:** cerrar el atraso de majors. ~½–1 día, un salto por commit local
(para poder revertir individualmente).

**Orden recomendado:**

1. [ ] `eslint` 10 + `eslint-config-prettier` 10 + `eslint-plugin-cypress` 7
   (juntos: ajustar `eslint.config.js` a las reglas renombradas/eliminadas).
2. [ ] `cypress-mochawesome-reporter` 5 (revisar `reporterOptions` y el
   `register` en `support/e2e.ts`; verificar el HTML generado).

**Validación local tras cada salto:** `npm run lint` + `npx tsc --noEmit` +
run de specs base + suite completa al cerrar la fase.

---

### Fase 4 — Endurecimiento (opcional)

**Objetivo:** backlog de mejoras posteriores. Sin orden estricto:

- [ ] **`husky` + `lint-staged`**: pre-commit con ESLint/Prettier sobre archivos
  modificados. Gana peso como quality gate dado que no hay CI (Decisión 1).
- [ ] **`cypress/require-data-selectors: error`**: el POM ya lo justifica.
- [ ] **Matrix de viewports** desktop/tablet/mobile — separar specs: el search
  del header es desktop-only (`hidden md:block`).
- [ ] **Regresión visual** (Percy o similar).
- [ ] **Reevaluar TypeScript 7** cuando Cypress declare soporte oficial.

---

## 6. Riesgos y mitigaciones

| # | Riesgo | Impacto | Mitigación |
| --- | --- | --- | --- |
| 1 | La app demo tiene estado dinámico (carrito pre-poblado, catálogo cambiante) que causó los skips originales | Tests reactivados flaky | Usar el botón `utility-reset` de `/api-test` como seeding determinista en `beforeEach`; asserts tolerantes donde el estado no sea controlable |
| 2 | Saltos mayores de ESLint rompen la config | `lint` en rojo | Un salto por commit; validar tras cada uno; revertir individualmente |
| 3 | `cypress-mochawesome-reporter` 5 cambia el contrato del reporter | Reportes rotos | Validar HTML generado tras el salto; `reporterOptions` documentados en la Fase 8 del plan V1 |
| 4 | Sin CI, una regresión puede pasar inadvertida | Suite en rojo descubierta tarde | Disciplina local (lint + tsc + specs base por commit); `husky` + `lint-staged` en Fase 4 como gate automático |
| 5 | Endpoints `/api/*` distintos a los asumidos | `api-contract` no reactivable | Paso 1 de la Fase 2 los descubre en runtime con `cy.intercept`; documentarlos en fixtures antes de escribir los asserts |

---

## 7. Criterios de aceptación

- [ ] **Suite habilitada**: ≥65/71 tests corriendo (skips residuales <10% y justificados).
- [ ] `npm run cy:run` completo en **verde localmente**.
- [ ] Cero dependencias sin uso; cero fixtures sin uso.
- [ ] Cero `cy.wait` hardcodeados y cero `force: true` en `cypress/support/commands.ts`.
- [ ] Majors actualizadas (`eslint` 10, `eslint-plugin-cypress` 7, `eslint-config-prettier` 10, `cypress-mochawesome-reporter` 5) con la excepción de TypeScript 7 documentada en [§4.3](#43-excluidas).
- [ ] `npm run lint` + `npx tsc --noEmit` limpios al cierre de cada fase.

---

## 8. Cronograma estimado

| Fase | Duración estimada | Riesgo |
| --- | --- | --- |
| Fase 1 — Higiene de dependencias y tooling | ½ día | Bajo |
| Fase 2 — Reactivación de tests skipeados | 2–4 días | Medio (depende del estado real de la app demo) |
| Fase 3 — Actualizaciones mayores | ½–1 día | Medio |
| Fase 4 — Endurecimiento (opcional) | A demanda | Bajo |
| **Total (Fases 1–3)** | **3–5 días** | — |

---

**Fin del documento.**
