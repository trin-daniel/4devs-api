import supertest from 'supertest'
import app from '../config/app'

describe('Content Type Middleware', () => {
  test('Should return default content type as json', async () => {
    app.get('/test_content_type', (request, response, next) => {
      response.send('')
      next()
    })
    await supertest(app)
      .get('/test_content_type')
      .expect('content-type', /(application\/json)/)
  })
})
