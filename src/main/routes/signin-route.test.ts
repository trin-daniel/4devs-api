import { MongoHelper } from '@infra/database/mongo/helper/mongo-helper'
import app from '@main/config/app'
import supertest from 'supertest'
import bcrypt from 'bcrypt'

describe('Signin Route', () => {
  beforeAll(async () => await MongoHelper.connect(process.env.MONGO_URL))
  afterAll(async () => await MongoHelper.disconnect())
  beforeEach(async () => {
    const collection = await MongoHelper.collection('accounts')
    await collection.deleteMany({})
  })

  describe('#POST/Signin', () => {
    test('Should return 200 if authentication succeeds', async () => {
      const collection = await MongoHelper.collection('accounts')
      const data =
      {
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: await bcrypt.hash('any_password', 12)
      }

      const credentials =
      {
        email: 'any_email@gmail.com',
        password: 'any_password'
      }

      await collection.insertOne(data)
      await supertest(app)
        .post('/api/signin')
        .send(credentials)
        .expect(200)
    })

    test('Should return 401 if invalid credentials are provided', async () => {
      const credentials =
      {
        email: 'any_email@gmail.com',
        password: 'any_password'
      }

      await supertest(app)
        .post('/api/signin')
        .send(credentials)
        .expect(401)
    })
  })
})
