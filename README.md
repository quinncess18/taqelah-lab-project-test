# Taqelah Boutique — Comprehensive Playwright Test Suite

![Playwright](https://img.shields.io/badge/Playwright-45ba4b?style=for-the-badge&logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?style=for-the-badge&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ed?style=for-the-badge&logo=docker&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088f0?style=for-the-badge&logo=github-actions&logoColor=white)

> **End-to-end test automation suite** for [taqelah.sg](https://taqelah.sg) — a modern fashion e-commerce platform. Demonstrates enterprise-grade testing practices with UI flows, mobile testing, visual regression, API CRUD operations, and advanced mocking patterns.

---

## 🎯 Project Highlights

✅ **643+ automated tests** across 8 focused test categories  
✅ **Multi-browser coverage** — Chromium, Firefox, WebKit  
✅ **Mobile-first testing** — iPhone 13, Pixel 5, tablet, widescreen viewports  
✅ **Visual regression testing** — Screenshot-based validation across devices  
✅ **API testing** — Real CRUD operations + network mocking patterns  
✅ **CI/CD integration** — GitHub Actions with 3-way parallel sharding  
✅ **Production-ready patterns** — Page Object Model, fixtures, global setup/teardown  

---

## 📦 Tech Stack

- **Framework**: Playwright (TypeScript)
- **Testing**: Jest/Playwright Test
- **Infrastructure**: Docker (isolated API environment)
- **CI/CD**: GitHub Actions
- **Code Quality**: ESLint, TypeScript strict mode

---

## 🏗️ Project Architecture

### Test Organization

| Category | Coverage | Scope |
|----------|----------|-------|
| **Functional** | Auth, search, cart, checkout | Desktop browsers (Chrome, Firefox, Safari) |
| **Mobile** | Navigation, negative flows, E2E checkout | iPhone 13, Pixel 5 — full mobile workflow |
| **Smoke** | Critical-path login validation | Cross-browser (Chromium, Firefox, WebKit) |
| **Regression** | Full E2E happy path | Chromium only — comprehensive flow validation |
| **Visual** | Screenshot regression | Desktop, mobile, tablet, widescreen — pixel-perfect |
| **API Inventory** | Real CRUD operations | Direct Docker API on port 8080 (isolated) |
| **API Mocking** | Request interception patterns | Network mock demos on separate port (isolated) |
| **Advanced Patterns** | Stateful mocks, conditional responses | Complex mock scenarios & request manipulation |

### Environment Isolation

```
┌─────────────────────────────────────────────┐
│          Live UI Tests (taqelah.sg)        │
│  Functional • Mobile • Smoke • Regression  │
└─────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│  API Tests (Docker - Port 8080, Isolated)  │
│        Real CRUD • No live DB connection   │
└─────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│  Mocking Tests (Isolated Port, No Server)  │
│   Playwright.route() • Network interception│
└─────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **Docker** (required for `api-local` tests only)

### Installation

```bash
# Clone and install dependencies
npm ci

# Install Playwright browsers and dependencies
npx playwright install --with-deps
```

### Environment Setup

```bash
# For API local testing, ensure Docker is running
docker --version

# Verify Node.js version
node --version  # Should be 18+
```

---

## 📋 Running Tests

### All Tests
```bash
npm test
```

### By Category
```bash
npm run test:smoke          # Quick smoke tests
npm run test:functional     # Functional flows
npm run test:regression     # Full E2E regression
npm run test:mobile         # Mobile-specific tests
npm run test:visual         # Visual regression tests
```

### By Environment
```bash
# Real API (Docker required)
npx playwright test --project=api-local

# Mocked API (no server needed)
npx playwright test --project=api-mocking
```

### Interactive & Debugging
```bash
npm run test:debug    # Playwright Inspector
npm run test:ui       # Playwright UI Mode (interactive)
npm run report        # View HTML test report
```

### Visual Regression
```bash
# Run visual tests
npm run test:visual

# Update snapshots after intentional UI changes
npm run test:visual:update
```

---

## 🏛️ Design Patterns & Best Practices

### Page Object Model (POM)
All UI tests follow the Page Object pattern for maintainability and reusability:
```
fixtures/               # Reusable test setup & pre-conditions

test-data/              # Hardcoded test data (no backend DB)
├── checkout-scenarios.json
├── products.csv
└── users.json

tests/
├── pages/              # Page Objects (POM)
│   ├── BasePage.ts
│   ├── LoginPage.ts
│   ├── ShopPage.ts
│   ├── CartPage.ts
│   └── index.ts
├── api-inventory/      # Real API CRUD tests (Docker isolated)
├── api-mocking/        # Network mocking patterns & request interception
├── functional/         # UI flows (auth, search, cart, checkout)
├── mobile/             # Mobile-specific tests (iPhone 13, Pixel 5)
├── regression/         # Full E2E happy path validation
├── smoke/              # Critical-path login checks
└── visual/             # Screenshot regression tests
```

### API Testing Approaches
**Real API**: Direct calls to Docker-isolated REST API for genuine CRUD testing  
**Mocked API**: Playwright `page.route()` for deterministic, backend-independent testing

### Global Setup & Teardown
- **`global-setup.ts`**: Runs once before all tests — launches browser, logs in as `ladies` user, saves authenticated session to `.auth/taqelah-user.json`
- **`global-teardown.ts`**: Runs after all tests — preserves auth file for debugging (deletion commented out)
- **Test Usage**: Tests load pre-authenticated state via `test.use({ storageState: '.auth/taqelah-user.json' })` or via `playwright.config.ts` settings

### Custom Fixtures
- **`visual-fixture.ts`** — `stablePage` fixture: Auto-waits for `networkidle`, fonts, and all images before taking screenshots
- **`worker-fixture.ts`** — `uniqueEmail` fixture: Generates worker-scoped unique email for each test execution

### Test Data
- `test-data/users.json` — Test user accounts with credentials, expected roles, and assigned promo codes
- `test-data/checkout-scenarios.json` — Checkout flow test scenarios with hardcoded customer data
- `test-data/products.csv` — Product search terms and expected results (parsed with `csv-parse`)

---

## 🔄 CI/CD Pipeline

GitHub Actions workflow runs on every push and pull request:

- ✅ **3-way sharding** — tests distributed across 3 parallel jobs for speed
- ✅ **Cross-browser** — Chromium, Firefox, WebKit in parallel
- ✅ **Artifact uploads** — HTML reports, screenshots, videos (on failure)
- ⏭️ **API local tests excluded** — require local Docker (manual testing)

**Note**: API tests run locally only; CI focuses on UI and mocking patterns.

---

## 📊 Test Metrics

| Metric | Count |
|--------|-------|
| Total Tests | 50+ |
| Test Files | 13 |
| Coverage Categories | 8 |
| Supported Browsers | 3 |
| Mobile Devices | 2 |
| Desktop Viewports | 4 |

---

## 🛠️ Key Features

### Robust Test Setup
- Globally configured fixtures for reusable page contexts
- Playwright config with retry logic and timeout management
- Automatic screenshot/video capture on failures
- Console log & network request monitoring

### Advanced Mocking Patterns
- **Stateful mocks** — simulate full CRUD with in-memory data
- **Conditional responses** — validate request data and return context-aware responses
- **Request interception** — capture, modify, and track API calls
- **Network simulation** — test slow responses, failures, and edge cases

### Mobile-First Testing
- Responsive design validation across viewports
- Touch interaction testing
- Mobile-specific navigation flows
- Device orientation handling

---

## 📚 Learning Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright API Testing Guide](https://playwright.dev/docs/api-testing)
- [Best Practices for E2E Testing](https://playwright.dev/docs/best-practices)

---

## 🤝 Contributing

This is a portfolio project showcasing test automation best practices. For feedback or suggestions, feel free to reach out.

---

## 🎓 What I Learned

Building this comprehensive test suite reinforced key skills in:

- **Test Architecture** — organizing tests by concern and criticality
- **Playwright Mastery** — real API testing, mocking, and advanced patterns
- **CI/CD Integration** — GitHub Actions parallelization and artifact management
- **Test Isolation** — data cleanup, fixture management, environment separation
- **Problem Solving** — debugging flaky tests, handling async operations, managing test state

---

## 🙏 Acknowledgments

**Built on foundations from:** Playwright Agentic AI workshop module

This framework originated from Playwright baseline workshop code and has been significantly expanded, refactored, and enhanced into a production-ready testing framework using Playwright and enterprise-grade best practices.

**Special thanks to:** Syam Sasi for creating the foundational workshop content and for championing this project with the testing community.

---

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---

**Status**: ✅ Project Complete — Ready for production-like workflows  
**Last Updated**: April 2026
