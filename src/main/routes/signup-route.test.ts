import supertest from 'supertest'
import app from '../config/app'

describe('Signup Route', () => {
  test('Should return 200 on sucess', async () => {
    const data =
    {
      name: 'any_name',
      email: 'any_email@gmail.com',
      password: 'any_password',
      confirmation: 'any_password'
    }
    await supertest(app)
      .post('/api/signup')
      .send(data)
      .expect(200)
  })
})
