Cypress.Commands.add('createCart', (token, products) => {
  return cy.request({
    method: 'POST',
    url: '/carrinhos',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json'
    },
    body: {
      produtos: products
    }
  }).then((response) => {
    expect(response.status).to.eq(201)
    return response
  })
})