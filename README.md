# Cypress API Tests - ServeRest

API test automation project built with Cypress and JavaScript for the ServeRest API, organized by domain and supported by reusable custom commands [1][2].

## Project structure

```bash
cypress-project/
├─ cypress/
│  ├─ e2e/
│  │  ├─ auth/
│  │  │  └─ login.cy.js
│  │  ├─ products/
│  │  │  └─ create-product.cy.js
│  │  └─ carts/
│  │     └─ list-carts.cy.js
│  ├─ fixtures/
│  │  ├─ login.json
│  │  └─ products.json
│  └─ support/
│     ├─ commands/
│     │  ├─ auth.commands.js
│     │  ├─ users.commands.js
│     │  ├─ products.commands.js
│     │  └─ carts.commands.js
│     ├─ commands.js
│     └─ e2e.js
├─ cypress.config.js
├─ package.json
└─ README.md
```

This structure separates specs, fixtures, and support commands to improve maintainability, scalability, and reuse across authentication, product, and cart scenarios [1][2].

## Technologies

- Cypress
- JavaScript
- ServeRest API

Cypress supports API testing with `cy.request()`, as well as hooks, fixtures, and custom commands, which fits well with the organization used in this project [3].

## Configuration

The `cypress.config.js` file centralizes the API base URL and the spec location pattern, allowing the use of relative routes such as `/login`, `/produtos`, and `/carrinhos` [1][2].

Example:

```js
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://serverest.dev',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js'
  },
  video: false
})
```

## Fixtures

Fixtures store reusable static test data for positive and negative login and product scenarios, reducing duplication and making the tests easier to read [3].

### `cypress/fixtures/login.json`

Contains examples such as:

- `validUser`
- `invalidPasswordUser`
- `missingEmailUser`
- `missingPasswordUser`
- `emptyBody`

These data sets support the documented `POST /login` validations, including successful authentication and `401` responses for invalid or incomplete credentials [1].

### `cypress/fixtures/products.json`

Contains base product payloads used as a starting point for unique-name and duplicate-name scenarios in the `POST /produtos` endpoint [1].

## Support

The `cypress/support` folder contains custom commands and the global Cypress bootstrap layer [3].

### `e2e.js`

This file imports `./commands`, making all custom commands available to every spec [3].

```js
import './commands'
```

### `commands.js`

This file acts as an aggregator and imports the command modules by domain [3].

```js
import './commands/auth.commands'
import './commands/users.commands'
import './commands/products.commands'
import './commands/carts.commands'
```

## Custom commands

The commands are split by domain to improve organization and maintenance [3].

### `auth.commands.js`

Contains:

- `cy.loginApi()`
- `cy.createAuthenticatedAdminSession()`

These commands allow authentication with an existing user or the creation of a complete admin session for scenarios that require a valid token and administrator permission, such as product creation and cart creation [1].

### `users.commands.js`

Contains:

- `cy.createRandomUser()`

This command creates dynamic users with `administrador: 'true'` or `administrador: 'false'`, which helps avoid data collisions and enables authorization scenarios such as validating `403` for administrator-only routes [1].

### `products.commands.js`

Contains:

- `cy.createProduct()`

This command centralizes authenticated product creation for scenarios where `POST /produtos` should return `201` on success or `400` for duplicate product names [1].

### `carts.commands.js`

Contains:

- `cy.createCart()`

This command wraps `POST /carrinhos`, which binds the cart to the user from the `Authorization` token and allows only one cart per user [2].

## Implemented specs

### `auth/login.cy.js`

Validates the `POST /login` endpoint with the following scenarios [1]:

- `200` with message `Login realizado com sucesso`
- `authorization` field returned
- JWT format with three parts
- token lifetime equal to 600 seconds
- `401` for invalid password
- `401` for missing email
- `401` for missing password
- `401` for empty body

The spec uses a dynamically created user before the suite runs to avoid dependency on pre-existing fixed credentials [3].

### `products/create-product.cy.js`

Validates the `POST /produtos` endpoint with the following documented scenarios [1]:

- `201` for successful creation
- `400` for duplicated product name
- `401` for missing, invalid, or expired token
- `403` for administrator-only route

The tests use a dynamic admin session and also create a non-admin user to validate the forbidden authorization scenario [1].

### `carts/list-carts.cy.js`

Validates the `GET /carrinhos` endpoint with deterministic setup created through the API before the assertions run [2].

Covered scenarios:

- `200` for cart listing
- response structure validation
- cart uniqueness per user verification
- filters by `_id`, `idUsuario`, `precoTotal`, and `quantidadeTotal`

The setup creates an admin user, authenticates, creates a product, and creates a cart with `POST /carrinhos`, reducing dependency on pre-existing environment data [2].

## How to run

### Install dependencies

```bash
npm install
```

### Open the Cypress UI

```bash
npm run cy:open
```

### Run all tests

```bash
npm run cy:run
```

### Run a specific spec

```bash
npx cypress run --spec cypress/e2e/auth/login.cy.js
npx cypress run --spec cypress/e2e/products/create-product.cy.js
npx cypress run --spec cypress/e2e/carts/list-carts.cy.js
```

## Applied best practices

- Dynamic data usage to avoid collisions between test executions [3]
- Separation between test data, reusable logic, and test scenarios [3]
- Domain-based custom commands for better readability [3]
- Use of `failOnStatusCode: false` in negative scenarios to validate 4xx responses without automatic Cypress failure [3]
- Deterministic setup for listing tests that depend on existing data [2]

## Suggested next steps

- Add response schema validation
- Create negative tests for `POST /carrinhos`, including duplicated product, nonexistent product, and insufficient quantity [2]
- Add data cleanup when needed for repeatable pipeline executions
- Evolve the custom commands with typing and additional documentation