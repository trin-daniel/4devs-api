import app from '@main/config/app'
import supertest from 'supertest'

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

  test('Should return xml content type when forced', async () => {
    app.get('/test_content_type_xml', (request, response, next) => {
      response.type('application/xml')
      response.send('')
      next()
    })
    await supertest(app)
      .get('/test_content_type_xml')
      .expect('content-type', /xml/)
  })
})
