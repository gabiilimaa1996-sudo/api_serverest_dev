describe('GET /carrinhos', () => {
  let cartId
  let userId
  let totalPrice
  let totalQuantity

  before(() => {
    cy.createAuthenticatedAdminSession().then(({ user, token }) => {
      userId = user._id

      cy.createProduct(token, {
        preco: 470,
        quantidade: 10,
        descricao: 'Mouse'
      }).then((product) => {
        cy.createCart(token, [
          {
            idProduto: product._id,
            quantidade: 2
          }
        ]).then((cartResponse) => {
          cartId = cartResponse.body._id
          totalPrice = product.preco * 2
          totalQuantity = 2
        })
      })
    })
  })

  context('List carts', () => {
    it('should return 200 and list registered carts', () => {
      cy.request('GET', '/carrinhos').then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('quantidade')
        expect(response.body).to.have.property('carrinhos')
        expect(response.body.carrinhos).to.be.an('array')
        expect(response.body.quantidade).to.eq(response.body.carrinhos.length)
      })
    })

    it('should return carts with the expected structure', () => {
      cy.request({
        method: 'GET',
        url: '/carrinhos',
        qs: { _id: cartId }
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.carrinhos).to.have.length.greaterThan(0)

        const cart = response.body.carrinhos[0]
        expect(cart).to.have.property('_id', cartId)
        expect(cart).to.have.property('idUsuario', userId)
        expect(cart).to.have.property('precoTotal', totalPrice)
        expect(cart).to.have.property('quantidadeTotal', totalQuantity)
        expect(cart).to.have.property('produtos')
        expect(cart.produtos).to.be.an('array').and.have.length.greaterThan(0)

        const product = cart.produtos[0]
        expect(product).to.have.property('idProduto')
        expect(product).to.have.property('quantidade', 2)
        expect(product).to.have.property('precoUnitario', 470)
      })
    })

    it('should return unique carts by user', () => {
      cy.request('GET', '/carrinhos').then((response) => {
        expect(response.status).to.eq(200)

        const userIds = response.body.carrinhos.map((cart) => cart.idUsuario)
        const uniqueUserIds = [...new Set(userIds)]

        expect(userIds.length).to.eq(uniqueUserIds.length)
      })
    })
  })

  context('Filter scenarios', () => {
    it('should filter carts by _id', () => {
      cy.request({
        method: 'GET',
        url: '/carrinhos',
        qs: { _id: cartId }
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.carrinhos).to.have.length(1)
        expect(response.body.carrinhos[0]._id).to.eq(cartId)
      })
    })

    it('should filter carts by idUsuario', () => {
      cy.request({
        method: 'GET',
        url: '/carrinhos',
        qs: { idUsuario: userId }
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.carrinhos).to.have.length(1)
        expect(response.body.carrinhos[0].idUsuario).to.eq(userId)
      })
    })

    it('should filter carts by precoTotal', () => {
      cy.request({
        method: 'GET',
        url: '/carrinhos',
        qs: { precoTotal: totalPrice }
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.carrinhos.length).to.be.greaterThan(0)
        response.body.carrinhos.forEach((cart) => {
          expect(cart.precoTotal).to.eq(totalPrice)
        })
      })
    })

    it('should filter carts by quantidadeTotal', () => {
      cy.request({
        method: 'GET',
        url: '/carrinhos',
        qs: { quantidadeTotal: totalQuantity }
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.carrinhos.length).to.be.greaterThan(0)
        response.body.carrinhos.forEach((cart) => {
          expect(cart.quantidadeTotal).to.eq(totalQuantity)
        })
      })
    })
  })
})