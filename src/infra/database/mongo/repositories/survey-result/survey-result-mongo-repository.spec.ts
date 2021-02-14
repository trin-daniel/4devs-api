import { Account, SurveyResult, Surveys } from '@domain/entities'
import { AccountDTO, SurveyDTO } from '@domain/dtos'
import { MongoHelper } from '@infra/database/mongo/helper/mongo-helper'
import { SurveyResultRepository } from '@infra/database/mongo/repositories/survey-result/survey-result-mongo-repository'

const mockAccountDTO = async (): Promise<AccountDTO> =>
  (
    {
      name: 'any_name',
      email: 'any_email@gmail.com',
      password: 'any_password'
    }
  )

const mockSurveyDTO = (): SurveyDTO => ({
  question: 'any_question',
  answers:
      [
        {
          image: 'any_images',
          answer: 'any_answer'
        },
        {
          image: 'another_image',
          answer: 'another_answer'
        }
      ],
  date: new Date()
})

const insertSurvey = async () => {
  const collection = await MongoHelper.collection('surveys')
  const { ops } = await collection.insertOne(mockSurveyDTO())
  const [res] = ops
  const survey = await MongoHelper.mapper(res)
  return survey as Surveys
}

const insertAccount = async () => {
  const collection = await MongoHelper.collection('accounts')
  const { ops } = await collection.insertOne(await mockAccountDTO())
  const [res] = ops
  const account = await MongoHelper.mapper(res) as Account
  return account
}

type SutTypes = {
  sut: SurveyResultRepository
}

const makeSut = (): SutTypes => {
  const sut = new SurveyResultRepository()
  return { sut }
}

describe('Survey Result Mongo Repository', () => {
  beforeAll(async () => await MongoHelper.connect(process.env.MONGO_URL))
  afterAll(async () => await MongoHelper.disconnect())

  beforeEach(async () => {
    await (await MongoHelper.collection('surveys')).deleteMany({})
    await (await MongoHelper.collection('accounts')).deleteMany({})
    await (await MongoHelper.collection('survey-results')).deleteMany({})
  })

  describe('#SaveSurveyResultRepository', () => {
    test('Should add a new survey result or update an existing survey result', async () => {
      const account = await insertAccount()
      const survey = await insertSurvey()
      const { sut } = makeSut()
      const surveyResult = await sut.save(
        {
          account_id: account.id,
          answer: survey.answers[0].answer,
          survey_id: survey.id,
          date: new Date()
        }
      )
      expect(surveyResult).toBeTruthy()
      expect(surveyResult).toHaveProperty('id')
      expect(surveyResult).toHaveProperty('answer', survey.answers[0].answer)
    })

    test('Should update the survey result if it already exists', async () => {
      const account = await insertAccount()
      const survey = await insertSurvey()
      const insertSurveyResult = await MongoHelper.collection('survey-results')
      const { ops } = await insertSurveyResult.insertOne(
        {
          account_id: account.id,
          answer: survey.answers[0].answer,
          survey_id: survey.id,
          date: new Date()
        }
      )
      const [res] = ops
      const format = await MongoHelper.mapper(res) as SurveyResult
      const { sut } = makeSut()
      const surveyResult = await sut.save(
        {
          account_id: account.id,
          answer: survey.answers[1].answer,
          survey_id: survey.id,
          date: new Date()
        }
      )
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.id).toEqual(format.id)
      expect(surveyResult).toHaveProperty('answer', survey.answers[1].answer)
    })
  })
})
