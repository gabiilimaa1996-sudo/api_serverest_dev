Cypress.Commands.add('createProduct', (token, overrides = {}) => {
  const timestamp = Date.now()
  const product = {
    nome: `Produto ${timestamp}`,
    preco: 470,
    descricao: 'Mouse',
    quantidade: 10,
    ...overrides
  }

  return cy.request({
    method: 'POST',
    url: '/produtos',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json'
    },
    body: product
  }).then((response) => {
    expect(response.status).to.eq(201)
    return { ...product, _id: response.body._id }
  })
})