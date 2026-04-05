# Test Plan — Taqelah Boutique

Tracks test coverage across all suites in this repository.
Updated progressively as each area is reviewed and gap-analyzed.

**Legend**
- ✅ Reviewed — scenarios verified, gaps closed, all passing
- 🔵 Exists — tests written and passing, not yet gap-analyzed
- ⬜ Not started

---

## Coverage Summary

| Area | Suite / Project | Spec Files | Scenarios | Status |
|---|---|---|---|---|
| [Functional — Auth](#functional--authentication) | `main-desktop-*`, `staging`, `production` | `authentication.spec.ts` | 11 | ✅ |
| [Functional — Search](#functional--search) | `main-desktop-*`, `staging`, `production` | `search.spec.ts` | 6 | ✅ |
| [Functional — Promo Codes (Parameterized)](#functional--promo-codes-parameterized) | `main-desktop-*`, `staging`, `production` | `parameterized-search.spec.ts` | 4 | ✅ |
| [Functional — Cart (happy)](#functional--cart-happy-path) | `main-desktop-*`, `staging`, `production` | `taqelah-cart-management.spec.ts` | 1 | ✅ |
| [Functional — Cart (negative)](#functional--cart-negative) | `main-desktop-*`, `staging`, `production` | `cart-negative.spec.ts` | 7 | ✅ |
| [Functional — Checkout (happy)](#functional--checkout-happy-path) | `main-desktop-*`, `staging`, `production` | `taqelah-checkout-final.spec.ts`, `taqelah-first-purchase-checkout.spec.ts` | 4 | ✅ |
| [Functional — Checkout (negative)](#functional--checkout-negative) | `main-desktop-*`, `staging`, `production` | `checkout-negative.spec.ts` | 13 | ✅ |
| [Mobile — Navigation (happy)](#mobile--navigation-happy-path) | `mobile-chrome`, `mobile-safari` | `navigation.mobile.spec.ts` | 11 | ✅ |
| [Mobile — Negative](#mobile--negative-scenarios) | `mobile-chrome`, `mobile-safari` | `negative.mobile.spec.ts` | 6 | ✅ |
| [Mobile — E2E Checkout](#mobile--e2e-checkout-flow) | `mobile-chrome`, `mobile-safari` | `checkout.mobile.spec.ts` | 5 | ✅ |
| [Smoke](#smoke) | `smoke-chromium`, `smoke-firefox`, `smoke-webkit` | `login.smoke.spec.ts` | 3 | ✅ |
| [Regression — E2E Happy Path](#regression--e2e-happy-path) | `regression` | `e2e-happy-path.spec.ts` | 8 | ✅ |
| [Visual — Homepage](#visual--homepage) | `visual-tests`, `visual-mobile`, `visual-tablet`, `visual-widescreen` | `homepage.visual.spec.ts` | 3 | 🔵 |
| [Visual — Products](#visual--products) | `visual-tests`, `visual-mobile`, `visual-tablet`, `visual-widescreen` | `products.visual.spec.ts` | 4 | 🔵 |
| [Visual — Advanced](#visual--advanced) | `visual-tests`, `visual-mobile`, `visual-tablet`, `visual-widescreen` | `advanced.visual.spec.ts` | 5 | 🔵 |
| [API Inventory — CRUD](#api-inventory--crud) | `api-local` | `get-items`, `post-items`, `put-items`, `patch-items`, `delete-items` | 5 | 🔵 |
| [API Inventory — Errors](#api-inventory--errors) | `api-local` | `get-items-error`, `get-item-by-id-error`, `put-items-error`, `patch-items-error`, `delete-items-error` | 5 | 🔵 |
| [API Mocking](#api-mocking) | `api-mocking` | `mocking-api-responses`, `advanced-patterns`, `monitoring-network`, `modifying-requests`, `modifying-responses` | 20 | 🔵 |

**Total scenarios: ~112**
**Reviewed: 75 (67%) ✅ &nbsp;|&nbsp; Existing, pending review: 37 (33%) 🔵**

---

## Functional — Authentication

**File:** `tests/functional/authentication.spec.ts`
**Projects:** `main-desktop-chrome`, `main-desktop-firefox`, `main-desktop-safari`, `staging`, `production`

| # | Scenario | Type | Status |
|---|---|---|---|
| 1 | User can login with each customer account | Happy path | ✅ |
| 2 | User session persists after app reload | Happy path | ✅ |
| 3 | User cannot login with invalid password | Negative | ✅ |
| 4 | User cannot login with non-existent account | Negative | ✅ |
| 5 | User cannot login with guest credentials (incorrect format) | Negative | ✅ |
| 6 | User cannot login with empty username | Negative | ✅ |
| 7 | User cannot login with empty password | Negative | ✅ |
| 8 | User cannot login with both fields empty | Negative | ✅ |
| 9 | Guest user cannot login with correct credentials (role restriction) | Negative | ✅ |
| 10 | User session is invalidated after logout | Negative | ✅ |
| 11 | Username character counter shows correct count | Edge case | ✅ |

---

## Functional — Search

**File:** `tests/functional/search.spec.ts`
**Projects:** `main-desktop-chrome`, `main-desktop-firefox`, `main-desktop-safari`, `staging`, `production`

| # | Scenario | Type | Status |
|---|---|---|---|
| 1 | Search for dresses returns results | Happy path | ✅ |
| 2 | Search for tops returns results | Happy path | ✅ |
| 3 | Search for accessories returns results | Happy path | ✅ |
| 4 | Search with unmatched term shows "No Results Found" and zero product cards | Negative | ✅ |
| 5 | Filter by category — New In | Happy path | ✅ |
| 6 | Filter by category — Sale | Happy path | ✅ |

---

## Functional — Promo Codes (Parameterized)

**File:** `tests/functional/parameterized-search.spec.ts`
**Projects:** `main-desktop-chrome`, `main-desktop-firefox`, `main-desktop-safari`, `staging`, `production`

| # | Scenario | Type | Status |
|---|---|---|---|
| 1 | User: ladies — Apply promo code SAVE10 | Happy path | ✅ |
| 2 | User: autumn — Apply promo code WELCOME20 | Happy path | ✅ |
| 3 | User: spring — Apply promo code FREESHIP | Happy path | ✅ |
| 4 | User: winter — Apply promo code SAVE10 | Happy path | ✅ |

---

## Functional — Cart (Happy Path)

**File:** `tests/functional/taqelah-cart-management.spec.ts`
**Projects:** `main-desktop-*`, `staging`, `production`

| # | Scenario | Type | Status |
|---|---|---|---|
| 1 | Add multiple products, update quantity, remove an item, keep totals consistent | Happy path | ✅ |

---

## Functional — Cart (Negative)

**File:** `tests/functional/cart-negative.spec.ts`
**Projects:** `main-desktop-*`, `staging`, `production`

| # | Scenario | Type | Status |
|---|---|---|---|
| 1 | Cart shows empty state message when no items are added | Negative | ✅ |
| 2 | Cart count badge shows 0 when cart is empty | Negative | ✅ |
| 3 | User can remove all items and see empty state | Negative | ✅ |
| 4 | Clicking decrease button when quantity is 1 removes the item | Edge case | ✅ |
| 5 | Adding product adds item to cart with correct count | Happy path | ✅ |
| 6 | Cart persists after page reload within same session | Edge case | ✅ |
| 7 | Close checkout modal and verify cart is preserved | Edge case | ✅ |

---

## Functional — Checkout (Happy Path)

**Files:** `tests/functional/taqelah-checkout-final.spec.ts`, `tests/functional/taqelah-first-purchase-checkout.spec.ts`
**Projects:** `main-desktop-*`, `staging`, `production`

| # | Scenario | Type | File | Status |
|---|---|---|---|---|
| 1 | Authenticated user adds item and opens checkout | Happy path | `checkout-final` | ✅ |
| 2 | Apply promo and complete checkout form | Happy path | `checkout-final` | ✅ |
| 3 | Place order and verify confirmation state | Happy path | `checkout-final` | ✅ |
| 4 | Logged-in user completes checkout details and places first order (unique email) | Happy path | `first-purchase` | ✅ |

---

## Functional — Checkout (Negative)

**File:** `tests/functional/checkout-negative.spec.ts`
**Projects:** `main-desktop-*`, `staging`, `production`

| # | Scenario | Type | Status |
|---|---|---|---|
| 1 | Submit checkout form with empty full name shows validation error | Negative | ✅ |
| 2 | Submit checkout form with invalid email shows validation error | Negative | ✅ |
| 3 | Submit checkout form with phone number less than 10 digits shows validation error | Negative | ✅ |
| 4 | Submit checkout form with address fields empty shows validation errors | Negative | ✅ |
| 5 | Submit checkout form with all required fields empty shows multiple errors | Negative | ✅ |
| 6 | Apply invalid promo code shows error message | Negative | ✅ |
| 7 | Apply valid promo code shows success message | Happy path | ✅ |
| 8 | Promo code is case-insensitive | Edge case | ✅ |
| 9 | Applying empty promo code does not apply a discount | Edge case | ✅ |
| 10 | Remove applied promo code before placing order | Edge case | ✅ |
| 11 | Form progress indicator updates as fields are filled | Edge case | ✅ |
| 12 | Real-time validation shows success state for valid fields | Edge case | ✅ |
| 13 | Checkout with multiple items in cart calculates correct totals | Happy path | ✅ |

---

## Mobile — E2E Checkout Flow

**File:** `tests/mobile/checkout.mobile.spec.ts`
**Projects:** `mobile-chrome` (Pixel 5), `mobile-safari` (iPhone 13)
**Auth:** `storageState: '.auth/taqelah-user.json'` via `browser.newContext()` in `beforeAll`
**Mode:** Serial — shared page instance across all steps

| # | Step | Action | Status |
|---|---|---|---|
| 1 | Verify authenticated state and clear cart | Load page via storageState, assert logout button visible, assert cart badge shows 0 | ✅ |
| 2 | Search for product and add to cart | Search "maxi dress", tap product, tap add-to-cart, verify modal closes and toast confirms | ✅ |
| 3 | Open cart and verify item | Hide toast, open cart, verify Maxi Dress present, assert checkout button enabled | ✅ |
| 4 | Proceed to checkout and fill form | Open checkout modal, apply promo code, fill all shipping fields | ✅ |
| 5 | Place order and verify confirmation | Tap place order, verify confirmation screen, order number, total, and continue shopping | ✅ |

---

## Mobile — Navigation (Happy Path)

**File:** `tests/mobile/navigation.mobile.spec.ts`
**Projects:** `mobile-chrome` (Pixel 5), `mobile-safari` (iPhone 13)
**Auth:** `test.use({ storageState: '.auth/taqelah-user.json' })`

| # | Scenario | Orientation | Status |
|---|---|---|---|
| 1 | Open mobile filter menu | Portrait | ✅ |
| 2 | Touch interactions for product selection | Portrait | ✅ |
| 3 | Display mobile-optimized cart (add → open → proceed to checkout) | Portrait | ✅ |
| 4 | Cart operations — update quantity and remove items | Portrait | ✅ |
| 5 | Cart persists after page reload | Portrait | ✅ |
| 6 | Cart preserved after closing checkout modal | Portrait | ✅ |
| 7 | Login page renders correctly in landscape | Landscape | ✅ |
| 8 | Product search and grid render correctly in landscape | Landscape | ✅ |
| 9 | Add item to cart and view cart in landscape | Landscape | ✅ |
| 10 | Checkout form renders correctly in landscape | Landscape | ✅ |
| 11 | Cart layout maintained on portrait → landscape orientation change | Both | ✅ |

---

## Mobile — Negative Scenarios

**File:** `tests/mobile/negative.mobile.spec.ts`
**Projects:** `mobile-chrome` (Pixel 5), `mobile-safari` (iPhone 13)

| # | Scenario | Orientation | Status |
|---|---|---|---|
| 1 | Invalid login attempt shows error message | Portrait | ✅ |
| 2 | Empty cart shows disabled checkout button | Portrait | ✅ |
| 3 | Checkout form validation error for empty name | Portrait | ✅ |
| 4 | Empty cart shows disabled checkout button in landscape | Landscape | ✅ |
| 5 | Checkout form validation error for empty name in landscape | Landscape | ✅ |
| 6 | Decrease quantity to zero removes item from cart | Portrait | ✅ |

---

## Smoke

**File:** `tests/smoke/login.smoke.spec.ts`
**Projects:** `smoke-chromium`, `smoke-firefox`, `smoke-webkit`

| # | Scenario | Status |
|---|---|---|
| 1 | Login form is displayed | ✅ |
| 2 | Login with valid credentials succeeds | ✅ |
| 3 | Validation error shown for invalid username format | ✅ |

---

## Regression — E2E Happy Path

**File:** `tests/regression/e2e-happy-path.spec.ts`
**Project:** `regression`
**Mode:** Serial — shared page instance across all steps
**User:** `autumn` | **Product:** Trench Coat | **Promo:** `WELCOME20` (20% off)

| # | Step | Assertion | Status |
|---|---|---|---|
| 1 | Login as `autumn` | Shop page visible, logout button present | ✅ |
| 2 | Search for "trench coat" | Search grid visible with at least one product card | ✅ |
| 3 | Click product → details modal opens | Modal visible and contains "Trench Coat" | ✅ |
| 4 | Add to cart from modal | Toast notification visible; modal closes | ✅ |
| 5 | Open cart | Trench Coat item present; cart total visible | ✅ |
| 6 | Click checkout button | Button visible, enabled, labelled "Checkout"; modal opens | ✅ |
| 7 | Apply WELCOME20, fill shipping form | Discount shows 20%; place order button visible and enabled | ✅ |
| 8 | Place order | Order confirmation and order number visible | ✅ |

---

## Visual — Homepage

**File:** `tests/visual/homepage.visual.spec.ts`
**Projects:** `visual-tests` (1280×720), `visual-mobile` (iPhone 13), `visual-tablet` (iPad Mini), `visual-widescreen` (1920×1080)

| # | Scenario | Status |
|---|---|---|
| 1 | Login page full-page screenshot | 🔵 |
| 2 | Login form element screenshot | 🔵 |
| 3 | Login button default and hover states | 🔵 |

---

## Visual — Products

**File:** `tests/visual/products.visual.spec.ts`
**Projects:** `visual-tests`, `visual-mobile`, `visual-tablet`, `visual-widescreen`

| # | Scenario | Status |
|---|---|---|
| 1 | Search page layout | 🔵 |
| 2 | Product grid appearance | 🔵 |
| 3 | Product details modal | 🔵 |
| 4 | Shopping cart appearance | 🔵 |

---

## Visual — Advanced

**File:** `tests/visual/advanced.visual.spec.ts`
**Projects:** `visual-tests`, `visual-mobile`, `visual-tablet`, `visual-widescreen`

| # | Scenario | Status |
|---|---|---|
| 1 | Full page with custom threshold | 🔵 |
| 2 | Screenshot with masked dynamic regions | 🔵 |
| 3 | Screenshot after hover interaction | 🔵 |
| 4 | Screenshot with style masking | 🔵 |
| 5 | Search input in empty, focused, and filled states | 🔵 |

---

## API Inventory — CRUD

**Files:** `tests/api-inventory/get-items.spec.ts`, `post-items.spec.ts`, `put-items.spec.ts`, `patch-items.spec.ts`, `delete-items.spec.ts`
**Project:** `api-local` (hits `localhost:8080`, serial, 1 worker)

| # | Scenario | Method | Status |
|---|---|---|---|
| 1 | Returns 200 and JSON array of items | GET /items | 🔵 |
| 2 | Returns valid item schema | GET /items | 🔵 |
| 3 | Creates a new item with 201 response | POST /items | 🔵 |
| 4 | Fully updates an existing item | PUT /items/{id} | 🔵 |
| 5 | Partially updates an existing item | PATCH /items/{id} | 🔵 |
| 6 | Deletes an existing item | DELETE /items/{id} | 🔵 |

---

## API Inventory — Errors

**Files:** `tests/api-inventory/get-items-error.spec.ts`, `get-item-by-id-error.spec.ts`, `put-items-error.spec.ts`, `patch-items-error.spec.ts`, `delete-items-error.spec.ts`
**Project:** `api-local`

| # | Scenario | Method | Status |
|---|---|---|---|
| 1 | Returns 404 for non-existent item collection path | GET /items | 🔵 |
| 2 | Returns 404 for non-existent item ID | GET /items/{id} | 🔵 |
| 3 | Returns error for invalid PUT request | PUT /items/{id} | 🔵 |
| 4 | Returns error for invalid PATCH request | PATCH /items/{id} | 🔵 |
| 5 | Returns error for invalid DELETE request | DELETE /items/{id} | 🔵 |

---

## API Mocking

**Files:** `tests/api-mocking/mocking-api-responses.spec.ts`, `advanced-patterns.spec.ts`, `monitoring-network.spec.ts`, `modifying-requests.spec.ts`, `modifying-responses.spec.ts`
**Project:** `api-mocking`

| # | Scenario | File | Status |
|---|---|---|---|
| 1 | Mock GET /api/items with custom data | `mocking-api-responses` | 🔵 |
| 2 | Mock GET /api/items with empty array | `mocking-api-responses` | 🔵 |
| 3 | Mock GET /api/items/{id} — item found | `mocking-api-responses` | 🔵 |
| 4 | Mock GET /api/items/{id} — 404 not found | `mocking-api-responses` | 🔵 |
| 5 | Mock POST /api/items — create item | `mocking-api-responses` | 🔵 |
| 6 | Mock 500 Internal Server Error | `mocking-api-responses` | 🔵 |
| 7 | Stateful mock — simulate full CRUD lifecycle | `advanced-patterns` | 🔵 |
| 8 | Mock with request counter | `advanced-patterns` | 🔵 |
| 9 | Conditional mock based on request content (validation) | `advanced-patterns` | 🔵 |
| 10 | Mock with fallback to real API for specific IDs | `advanced-patterns` | 🔵 |
| 11 | Simulate network failure (abort) | `advanced-patterns` | 🔵 |
| 12 | Track all API requests by method and URL | `monitoring-network` | 🔵 |
| 13 | Track API response status codes | `monitoring-network` | 🔵 |
| 14 | Wait for specific API response before asserting | `monitoring-network` | 🔵 |
| 15 | Count requests grouped by HTTP method | `monitoring-network` | 🔵 |
| 16 | Track request timing (duration) | `monitoring-network` | 🔵 |
| 17 | Verify captured POST request body content | `monitoring-network` | 🔵 |
| 18–20 | Modifying requests / responses (pending detail) | `modifying-requests`, `modifying-responses` | 🔵 |

---

## How to Update This Plan

1. When gap analysis is done for an area, change 🔵 → ✅ on each scenario row and in the summary table.
2. If a scenario is added, append it to the relevant section and increment the count in the summary table.
3. If a scenario is removed (dead code), strike it out or delete the row and decrement the count.
4. Update the **Reviewed** percentage in the summary once a section is complete.
