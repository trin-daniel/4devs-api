import app from '@Main/Config/App'
import supertest from 'supertest'
import Faker from 'faker'
describe('Body parser middleware', () => {
  test('Should parse body as JSON', async () => {
    const PASSWORD_FREZEED = Faker.internet.password()
    const AccountDTO =
    {
      name: Faker.internet.userName(),
      email: Faker.internet.email(),
      password: PASSWORD_FREZEED,
      confirmation: PASSWORD_FREZEED
    }
    app
      .post('/test_body_parser', (request, response, next) => {
        response.send(request.body)
        next()
      })
    await supertest(app)
      .post('/test_body_parser')
      .send(AccountDTO)
      .expect(AccountDTO)
  })
})
