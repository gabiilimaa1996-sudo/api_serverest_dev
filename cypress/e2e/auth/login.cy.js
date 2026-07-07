describe('POST /login', () => {
  let loginData
  let validUser

  before(() => {
    cy.createRandomUser({ administrador: 'true' }).then((user) => {
      validUser = {
        email: user.email,
        password: user.password
      }
    })
  })

  beforeEach(() => {
    cy.fixture('login').then((data) => {
      loginData = data
    })
  })

  context('Success scenarios', () => {
    it('should return 200 and success message when credentials are valid', () => {
      cy.loginApi(validUser).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('message', 'Login realizado com sucesso')
        expect(response.body).to.have.property('authorization')
        expect(response.body.authorization).to.match(/^Bearer\s.+/)
      })
    })

    it('should return a JWT token with 3 parts', () => {
      cy.loginApi(validUser).then((response) => {
        const token = response.body.authorization.replace('Bearer ', '')
        const tokenParts = token.split('.')

        expect(tokenParts).to.have.length(3)
      })
    })

    it('should return a token that expires in 600 seconds', () => {
      cy.loginApi(validUser).then((response) => {
        const token = response.body.authorization.replace('Bearer ', '')
        const payload = JSON.parse(atob(token.split('.')[1]))

        expect(payload.exp - payload.iat).to.eq(600)
      })
    })
  })

  context('Unauthorized scenarios', () => {
    it('should return 401 when password is invalid', () => {
      cy.loginApi({
        email: validUser.email,
        password: loginData.invalidPasswordUser.password
      }).then((response) => {
        expect(response.status).to.eq(401)
        expect(response.body).to.have.property('message', 'Email e/ou senha inválidos')
      })
    })

    it('should return 401 when email is missing', () => {
      cy.request({
        method: 'POST',
        url: '/login',
        body: loginData.missingEmailUser,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(401)
      })
    })

    it('should return 401 when password is missing', () => {
      cy.request({
        method: 'POST',
        url: '/login',
        body: loginData.missingPasswordUser,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(401)
      })
    })

    it('should return 401 when request body is empty', () => {
      cy.request({
        method: 'POST',
        url: '/login',
        body: loginData.emptyBody,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(401)
      })
    })
  })
})