import { MongoHelper } from '../../infra/database/mongo/helper/mongo-helper'
import app from '../config/app'
import supertest from 'supertest'
import env from '../config/env'
import bcrypt from 'bcrypt'
import jsonWebToken from 'jsonwebtoken'

describe('Add Survey Route', () => {
  beforeAll(async () => await MongoHelper.connect(process.env.MONGO_URL))
  afterAll(async () => await MongoHelper.disconnect())
  beforeEach(async () => {
    const collection = await MongoHelper.collection('accounts')
    await collection.deleteMany({})
  })

  describe('#POST/Surveys', () => {
    test('Should return 403 if no token is provided', async () => {
      const data =
      {
        question: 'any_question',
        answers: [
          {
            answer: 'any_answer',
            image: 'any_image'
          }
        ]
      }
      await supertest(app)
        .post('/api/surveys')
        .send(data)
        .expect(403)
    })

    test('Should return 204 if valid token is provided', async () => {
      const credentials =
      {
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: await bcrypt.hash('any_password', 12),
        role: 'admin'
      }
      const collection = await MongoHelper.collection('accounts')
      const { ops } = await collection.insertOne(credentials)
      const [res] = ops
      const token = jsonWebToken.sign('any_token', env.SECRET_KEY)
      await collection.updateOne(
        { _id: res._id },
        { $set: { token } }
      )
      const data =
      {
        question: 'any_question',
        answers: [{ answer: 'any_answer', image: 'any_image' }]
      }
      await supertest(app)
        .post('/api/surveys')
        .set('x-access-token', token)
        .send(data)
        .expect(204)
    })
  })
})
