import { AccountDTO, SurveyDTO } from '@domain/dtos'
import { Account, Surveys } from '@domain/entities'
import { MongoHelper } from '@infra/database/mongo/helper/mongo-helper'
import { sign } from 'jsonwebtoken'
import app from '@main/config/app'
import supertest from 'supertest'
import bcrypt from 'bcrypt'
import env from '@main/config/env'

const mockAccountDTO = async (): Promise<AccountDTO> =>
  (
    {
      name: 'any_name',
      email: 'any_email@gmail.com',
      password: await bcrypt.hash('any_password', 12)
    }
  )

const insertAccount = async () => {
  const collection = await MongoHelper.collection('accounts')
  const { ops } = await collection.insertOne(await mockAccountDTO())
  const [res] = ops
  const account = await MongoHelper.mapper(res) as Account

  return account
}

const updateTokenAccount = async () => {
  const account = await insertAccount()
  const collection = await MongoHelper.collection('accounts')
  await collection.updateOne(
    { _id: account.id },
    { $set: { token: sign({ id: 'any_id' }, env.SECRET_KEY) } }
  )
  return MongoHelper.mapper(await collection.findOne({ _id: account.id }))
}

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

const insertSurvey = async () => {
  const collection = await MongoHelper.collection('surveys')
  const { ops } = await collection.insertOne(mockSurveyDTO())
  const [res] = ops
  return MongoHelper.mapper(res) as Surveys
}

describe('Survey Result Route', () => {
  beforeAll(async () => await MongoHelper.connect(process.env.MONGO_URL))
  afterAll(async () => await MongoHelper.disconnect())
  beforeEach(async () => {
    const collection = await MongoHelper.collection('accounts')
    await collection.deleteMany({})
    const surveysCollection = await MongoHelper.collection('surveys')
    await surveysCollection.deleteMany({})
  })

  describe('#PUT/surveys', () => {
    test('Should return 403 if no token is provided', async () => {
      await supertest(app)
        .put('/api/surveys/any_id/results')
        .send({ answer: 'any_answer' })
        .expect(403)
    })

    test('Should return 200 if token is provided', async () => {
      const survey = await insertSurvey()
      const { token } = await updateTokenAccount()
      await supertest(app)
        .put(`/api/surveys/${survey.id}/results`)
        .set('x-access-token', token)
        .send({ answer: 'any_answer' })
        .expect(200)
    })
  })
})
