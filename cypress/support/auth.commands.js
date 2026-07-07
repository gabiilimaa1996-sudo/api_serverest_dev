Cypress.Commands.add('loginApi', (overrides = {}) => {
  if (overrides.email && overrides.password) {
    return cy.request({
      method: 'POST',
      url: '/login',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        email: overrides.email,
        password: overrides.password
      },
      failOnStatusCode: false
    })
  }

  return cy.fixture('login').then(({ validUser }) => {
    const body = { ...validUser, ...overrides }

    return cy.request({
      method: 'POST',
      url: '/login',
      headers: {
        'Content-Type': 'application/json'
      },
      body,
      failOnStatusCode: false
    })
  })
})

Cypress.Commands.add('createAuthenticatedAdminSession', () => {
  return cy.createRandomUser({ administrador: 'true' }).then((user) => {
    return cy.loginApi({ email: user.email, password: user.password }).then((loginResponse) => {
      expect(loginResponse.status).to.eq(200)
      return {
        user,
        token: loginResponse.body.authorization
      }
    })
  })
})