# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Playwright + TypeScript test suite for [Taqelah Boutique](https://taqelah.sg) — a fashion e-commerce site. Tests cover UI functional flows, API CRUD operations, API mocking/network interception, visual regression, smoke, regression, and mobile testing.

## Commands

```bash
# Install dependencies
npm ci

# Install Playwright browsers
npx playwright install --with-deps

# Run all tests
npm test

# Run a specific test file
npx playwright test tests/functional/taqelah-login.spec.ts

# Run a specific project
npx playwright test --project=smoke-chromium
npx playwright test --project=api-local
npx playwright test --project=api-mocking

# Run by category (npm scripts)
npm run test:smoke
npm run test:regression
npm run test:mobile
npm run test:visual

# Update visual snapshots
npm run test:visual:update

# Debug a test interactively
npm run test:debug

# Open Playwright UI mode
npm run test:ui

# View last HTML report
npm run report
```

## Architecture

### Test Projects (playwright.config.ts)

There are 16 test projects, split by purpose:

| Project | Match Pattern | Notes |
|---|---|---|
| `main-desktop-*` | All specs | Chrome/Firefox/Safari desktop |
| `mobile-safari`, `mobile-chrome` | All specs | iPhone 13 / Pixel 5 emulation |
| `smoke-*` | `smoke/**` | Fast critical-path checks |
| `regression` | `regression/**` | Full workflow tests (Chromium only) |
| `visual-tests`, `visual-mobile`, `visual-tablet`, `visual-widescreen` | `visual/**` | Screenshot comparison |
| `api-local` | `api-inventory/**` | Hits `localhost:8080`, runs **serially** (1 worker) |
| `api-mocking` | `api-mocking/**` | Network interception tests |

### Global Setup / Auth

`global-setup.ts` runs once before all non-API tests:
- Launches Chromium, logs in using credentials from `test-data/users.json` at the demo site
- Saves browser storage state to `.auth/` (gitignored — generated locally on first run)
- Most test projects load this stored auth via `storageState`

`global-teardown.ts` preserves the auth file for debugging (deletion is commented out).

### Page Object Model

All page classes live in `tests/pages/` and extend `BasePage` (which provides `navigateTo`, `wait`, `isElementVisible`). Import them via the barrel `tests/pages/index.ts`.

### Test Data

- `test-data/users.json` — test user accounts, expected roles, promo codes
- `test-data/checkout-scenarios.json` — checkout flow scenarios
- `test-data/products.csv` — product search terms and expected results (parsed with `csv-parse`)

### Custom Fixtures (`fixtures/`)

- `visual-fixture.ts` — `stablePage` fixture: waits for `networkidle`, fonts, and all images before taking screenshots
- `worker-fixture.ts` — `uniqueEmail` fixture: generates a worker-scoped unique email
- `test-options.ts` — custom CLI options `--environment` (staging|production) and `--userType` (customer|guest)

### CI/CD

`.github/workflows/playwright.yml`:
- Runs on `push` and `pull_request` on `windows-latest`
- 3-way sharding (`--shard=1/3`, `2/3`, `3/3`) for parallelism
- Merges blob reports from shards into a single HTML report artifact
- CI uses 1 worker and 2 retries; local uses 4 workers and 0 retries

## Known Gotchas

These are non-obvious issues already fixed — keep them in mind when editing the mobile spec or adding new screenshot tests.

- **Cart state bleeds between tests** — the site restores `taqelahCart` from localStorage on login. `beforeEach` clears it with `localStorage.setItem('taqelahCart', '[]')` after login to ensure a clean state.
- **Remove button has no `data-testid`** — use `getByText('Remove')`, not `getByTestId('remove-item')`.
- **Add-to-cart toast doesn't auto-dismiss** — before any `page.screenshot()` call following an add-to-cart action, hide the toast with `page.evaluate(() => { const t = document.getElementById('toastMessage'); if (t?.parentElement) t.parentElement.style.display = 'none'; })`.
- **Orientation change requires `page.setViewportSize()`** — `window.orientation` is read-only and dispatching `orientationchange` does not resize the Playwright viewport. Swap dimensions with `const vp = page.viewportSize(); await page.setViewportSize({ width: vp!.height, height: vp!.width })`.
- **`.auth/` is gitignored** — the directory is generated locally by `global-setup.ts` on first run. Do not commit it. The old `/playwright/.auth/` entry in `.gitignore` did not cover the repo-root `.auth/` path; `/.auth/` has been added explicitly.
- **`main-desktop-*` projects must declare `dependencies: ['setup']`** — without this, Chrome/Firefox/Safari projects can run before `global-setup.ts` completes in CI, causing auth failures. All three desktop projects now include `dependencies: ['setup']` in `playwright.config.ts`.
- **`staging` and `production` projects have no `dependencies: ['setup']`** — they rely on `.auth/taqelah-user.json` created by `globalSetup`, which always runs before any test project. Do not add per-user auth file references (e.g. `ladies.json`) to these projects without also adding the dependency.
- **Cart does not merge duplicate product rows** — adding the same product twice creates two separate cart rows, not one row with quantity 2. Do not write tests that assert `toHaveCount(1)` after adding the same item twice.
- **Cart count badge does not reflect total quantity** — the badge tracks by a metric other than cumulative item count (e.g. unique SKUs or a separate counter). Assertions like `expect(count).toBeGreaterThanOrEqual(2)` after adding two different products will fail.
- **`staging`/`production` projects pick up all specs** — neither has a `testDir` restriction, so they run every spec under `tests/` except visual. This is intentional for environment-level cross-checks but means new spec files are automatically included in both environment runs.
- **HTML report requires `npm run report` to open** — `open: 'always'` in the reporter config does not reliably launch a browser in shell-based environments. Run `npm run report` (or `npx playwright show-report`) to serve the report at `http://localhost:9323`.

## Key Config Values

- **Base URL**: `https://taqelah.sg`
- **API local base URL**: `http://localhost:8080`
- **Default timeout**: 20 seconds
- **Visual diff threshold**: 5% pixel ratio, 10% color difference, 20% snapshot threshold
- **Headless**: `false` in config (override with `--headed=false` or CI env detection)
