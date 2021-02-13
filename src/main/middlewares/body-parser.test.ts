import app from '@main/config/app'
import supertest from 'supertest'

describe('Body parser middleware', () => {
  test('Should parse body as JSON', async () => {
    const data =
    {
      name: 'any_name',
      email: 'any_email@gmail.com',
      password: 'any_password',
      confirmation: 'any_password'
    }
    app
      .post('/test_body_parser', (request, response, next) => {
        response.send(request.body)
        next()
      })
    await supertest(app)
      .post('/test_body_parser')
      .send(data)
      .expect(data)
  })
})
