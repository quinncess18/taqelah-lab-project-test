# Actionable E2E Improvement Plan for Taqelah

## High-Value Happy Paths to Implement

### 1. New User Registration and First Purchase
- **Scope**: Complete journey from registration to order confirmation.
- **Architecture**: Implement as a **Serial Execution Flow**.
- **Reasoning**: This flow involves state changes (new user creation) that should be validated in a single, isolated session to ensure data integrity and clear failure points.

### 2. Multi-Product Discovery and Cart Management
- **Scope**: Adding multiple items, removing an item, and verifying subtotal updates.
- **Architecture**: Use **Shared Authentication Context** (`.auth/taqelah-user.json`).
- **Reasoning**: These are atomic actions on a stable session, allowing for faster, parallel execution.

### 3. Integrated Checkout with Promo Codes
- **Scope**: Authenticated user selects products, applies a valid promo code, and completes the full multi-step checkout.
- **Architecture**: **Serial Execution Flow** for the checkout steps.
- **Reasoning**: Transitions within the checkout modal are highly dependent on the previous step's state (e.g., shipping address affecting tax/total).

## Page Object Model (POM) Enhancements

### `CartPage.ts`
- **New Locators**: `removeItemButton(productId)`, `itemQuantityInput(productId)`, `cartSubtotal`, `cartTotal`.
- **New Methods**: `removeItem(productId)`, `updateQuantity(productId, amount)`, `getCartTotal()`.
- **Improvement**: Replace generic `getByTestId('cart-items')` logic with more granular item-level assertions for better reliability.

### `ShopPage.ts`
- **New Method**: `addProductToCart(productName)` - a higher-level helper that handles search, click, and the "Add to Cart" button interaction in one go.

## Recommended Best Practices
- **State Management**: For checkout flows, use `test.describe.configure({ mode: 'serial' })` and a shared `page` object across `test` blocks to maintain the modal state without repetitive logins.
- **Data Fixtures**: Utilize `test-data/users.json` for consistent user credentials and `uniqueEmail` fixtures for registration tests.
- **Assertions**: Use soft assertions for non-critical UI elements (like cosmetic labels) while keeping hard assertions for the functional funnel (like the presence of the checkout button).
