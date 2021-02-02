import { MongoHelper } from '../../infra/database/mongo/helper/mongo-helper'
import app from '../config/app'
import supertest from 'supertest'

describe('Signup Route', () => {
  beforeAll(async () => await MongoHelper.connect(process.env.MONGO_URL))
  afterAll(async () => await MongoHelper.disconnect())

  beforeEach(async () => {
    const collection = await MongoHelper.collection('accounts')
    await collection.deleteMany({})
  })

  describe('#POST/Signup', () => {
    test('Should return 200 when adding account successfully', async () => {
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
})
