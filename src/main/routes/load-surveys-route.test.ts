import { AccountDTO, SurveyDTO } from '../../domain/dtos'
import { Account, Surveys } from '../../domain/entities'
import { MongoHelper } from '../../infra/database/mongo/helper/mongo-helper'
import app from '../config/app'
import env from '../config/env'
import supertest from 'supertest'
import jsonwebtoken from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const mockSurveyDTO = (): SurveyDTO => ({
  question: 'any_question',
  answers:
  [
    {
      image: 'any_images',
      answer: 'any_answer'
    }
  ],
  date: new Date()
})

const mockAccountDTO = async (): Promise<AccountDTO> =>
  ({
    name: 'any_name',
    email: 'any_email@gmail.com',
    password: await bcrypt.hash('any_password', 12)
  })

const insertSurvey = async () => {
  const collection = await MongoHelper.collection('surveys')
  const { ops } = await collection.insertOne(mockSurveyDTO())
  const [res] = ops
  return res as Surveys
}

const insertAccount = async () => {
  const collection = await MongoHelper.collection('accounts')
  const { ops } = await collection.insertOne(await mockAccountDTO())
  const [res] = ops
  const account = await MongoHelper.mapper(res) as Account
  return account
}

describe('Load Surveys Route', () => {
  beforeAll(async () => await MongoHelper.connect(process.env.MONGO_URL))
  afterAll(async () => await MongoHelper.disconnect())
  beforeEach(async () => {
    const collection = await MongoHelper.collection('accounts')
    const surveysCollection = await MongoHelper.collection('accounts')
    await collection.deleteMany({})
    await surveysCollection.deleteMany({})
  })

  describe('#GET/surveys', () => {
    test('Should return 403 if no token is provided', async () => {
      await supertest(app)
        .get('/api/surveys')
        .expect(403)
    })

    test('Should return 200 if a valid token is provided', async () => {
      const account = await insertAccount()
      await insertSurvey()
      const collection = await MongoHelper.collection('accounts')
      const token = jsonwebtoken.sign('any_token', env.SECRET_KEY)
      await collection.updateOne(
        { _id: account.id },
        { $set: { token } }
      )
      await supertest(app)
        .get('/api/surveys')
        .set('x-access-token', token)
        .expect(200)
    })
  })
})
