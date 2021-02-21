import app from '@Main/Config/App'
import supertest from 'supertest'

describe('Cors middleware', () => {
  test('Should enable cors middleware', async () => {
    app
      .get('/test_cors', (request, response, next) => {
        response.send()
        next()
      })
    await supertest(app)
      .get('/test_cors')
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-methods', '*')
      .expect('access-control-allow-headers', '*')
  })
})
