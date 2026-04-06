Taqelah Boutique — Playwright Test Suite

  End-to-end test suite for https://taqelah.sg, a fashion e-commerce demo site. Built with Playwright and        
  TypeScript, covering functional UI flows, mobile, visual regression, smoke, regression, API CRUD, and API      
  mocking.

  Prerequisites

  - Node.js 18+
  - https://www.docker.com/ — required only for api-local tests (RESTful Inventory Manager on port 8080)

  Setup

  npm ci
  npx playwright install --with-deps

  Running Tests

  # Run all tests
  npm test

  # By category
  npm run test:smoke
  npm run test:regression
  npm run test:mobile
  npm run test:visual

  # Specific project
  npx playwright test --project=api-local     # requires Docker
  npx playwright test --project=api-mocking

  # Update visual snapshots
  npm run test:visual:update

  # Debug interactively
  npm run test:debug

  # Open UI mode
  npm run test:ui

  # View HTML report
  npm run report

  Test Structure

  ┌──────────────────────┬────────────────────────────────────────────────────────────────┐
  │        Folder        │                            Coverage                            │
  ├──────────────────────┼────────────────────────────────────────────────────────────────┤
  │ tests/functional/    │ Auth, search, cart, checkout — desktop browsers                │
  ├──────────────────────┼────────────────────────────────────────────────────────────────┤
  │ tests/mobile/        │ Navigation, negative cases, E2E checkout — iPhone 13 & Pixel 5 │
  ├──────────────────────┼────────────────────────────────────────────────────────────────┤
  │ tests/smoke/         │ Critical-path login checks — Chromium, Firefox, WebKit         │
  ├──────────────────────┼────────────────────────────────────────────────────────────────┤
  │ tests/regression/    │ Full E2E happy path — Chromium only                            │
  ├──────────────────────┼────────────────────────────────────────────────────────────────┤
  │ tests/visual/        │ Screenshot comparison — desktop, mobile, tablet, widescreen    │
  ├──────────────────────┼────────────────────────────────────────────────────────────────┤
  │ tests/api-inventory/ │ Real CRUD calls against local Docker API                       │
  ├──────────────────────┼────────────────────────────────────────────────────────────────┤
  │ tests/api-mocking/   │ Playwright network interception patterns                       │
  └──────────────────────┴────────────────────────────────────────────────────────────────┘

  CI

  Runs on GitHub Actions (windows-latest) with 3-way sharding on every push and pull request. api-local tests are
   excluded from CI as they require a local Docker container.
