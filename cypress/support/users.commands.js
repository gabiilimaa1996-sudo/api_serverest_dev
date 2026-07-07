Cypress.Commands.add('createRandomUser', ({ administrador = 'true' } = {}) => {
  const timestamp = Date.now()
  const user = {
    nome: `Usuario ${timestamp}`,
    email: `usuario.${timestamp}@qa.com`,
    password: 'teste',
    administrador
  }

  return cy.request({
    method: 'POST',
    url: '/usuarios',
    body: user,
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((response) => {
    expect(response.status).to.eq(201)
    return { ...user, _id: response.body._id }
  })
})