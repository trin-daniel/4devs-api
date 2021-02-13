import { Account } from '@domain/entities'
import { AccountDTO, SurveyDTO } from '@domain/dtos'
import { MongoHelper } from '@infra/database/mongo/helper/mongo-helper'
import app from '@main/config/app'
import env from '@main/config/env'
import bcrypt from 'bcrypt'
import jsonWebToken from 'jsonwebtoken'
import supertest from 'supertest'

const mockSurveyDTO = (): Omit<SurveyDTO, 'date'> => ({
  question: 'any_question',
  answers:
  [
    {
      image: 'any_images',
      answer: 'any_answer'
    }
  ]
})

interface AccountWithRole extends AccountDTO {
  role: 'admin'
}

const mockAccountDTO = async (): Promise<AccountWithRole> =>
  ({
    name: 'any_name',
    email: 'any_email@gmail.com',
    password: await bcrypt.hash('any_password', 12),
    role: 'admin'
  })

const insertAccount = async () => {
  const collection = await MongoHelper.collection('accounts')
  const { ops } = await collection.insertOne(await mockAccountDTO())
  const [res] = ops
  const account = await MongoHelper.mapper(res) as Account

  return account
}

describe('Add Survey Route', () => {
  beforeAll(async () => await MongoHelper.connect(process.env.MONGO_URL))
  afterAll(async () => await MongoHelper.disconnect())
  beforeEach(async () => {
    const collection = await MongoHelper.collection('accounts')
    const surveysCollection = await MongoHelper.collection('surveys')
    await collection.deleteMany({})
    await surveysCollection.deleteMany({})
  })

  describe('#POST/Surveys', () => {
    test('Should return 403 if no token is provided', async () => {
      await supertest(app)
        .post('/api/surveys')
        .send(mockSurveyDTO())
        .expect(403)
    })

    test('Should return 204 if valid token is provided', async () => {
      const collection = await MongoHelper.collection('accounts')
      const { id } = await insertAccount()
      const token = jsonWebToken.sign('any_token', env.SECRET_KEY)
      await collection.updateOne(
        { _id: id },
        { $set: { token } }
      )
      await supertest(app)
        .post('/api/surveys')
        .set('x-access-token', token)
        .send(mockSurveyDTO())
        .expect(204)
    })
  })
})
