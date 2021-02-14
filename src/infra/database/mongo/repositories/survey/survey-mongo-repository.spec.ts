import { SurveyDTO } from '@domain/dtos'
import { Surveys } from '@domain/entities'
import { MongoHelper } from '@infra/database/mongo/helper/mongo-helper'
import { SurveyMongoRepository } from '@infra/database/mongo/repositories/survey/survey-mongo-repository'

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
  const survey = await MongoHelper.mapper(res)
  return survey as Surveys
}

type SutTypes = {
  sut: SurveyMongoRepository
}

const makeSut = (): SutTypes => {
  const sut = new SurveyMongoRepository()
  return { sut }
}

describe('Survey Mongo Repository', () => {
  beforeAll(async () => await MongoHelper.connect(process.env.MONGO_URL))
  afterAll(async () => await MongoHelper.disconnect())

  beforeEach(async () => {
    const collection = await MongoHelper.collection('surveys')
    await collection.deleteMany({})
  })

  describe('#AddSurveyRepository', () => {
    test('Should add a new survey when it is successful', async () => {
      const { sut } = makeSut()
      await sut.add(mockSurveyDTO())
      const collection = await MongoHelper.collection('surveys')
      const survey = await collection.findOne({ question: mockSurveyDTO().question })
      expect(survey).toBeTruthy()
      expect(survey).toHaveProperty('_id')
      expect(survey).toHaveProperty('answers')
    })
  })

  describe('#LoadSurveysRepository', () => {
    test('Should return all surveys if loadAll is successful', async () => {
      const collection = await MongoHelper.collection('surveys')
      await collection.insertOne(mockSurveyDTO())
      const { sut } = makeSut()
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(1)
      expect(surveys[0]).toHaveProperty('_id')
    })

    test('Should return an empty array if loadAll returns empty', async () => {
      const { sut } = makeSut()
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(0)
    })
  })

  describe('#LoadSurveyByIdRepository', () => {
    test('Should return a survey if load by id is successful', async () => {
      const { id } = await insertSurvey()
      const { sut } = makeSut()
      const survey = await sut.loadById(id)
      expect(survey).toBeTruthy()
      expect(survey).toHaveProperty('answers')
      expect(survey).toHaveProperty('question')
    })
  })
})
