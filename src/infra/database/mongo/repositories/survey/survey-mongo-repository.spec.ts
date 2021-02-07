import { SurveyMongoRepository } from './survey-mongo-repository'
import { SurveyDTO } from '../../../../../domain/dtos'
import { MongoHelper } from '../../helper/mongo-helper'

const mockSurveyDTO = (): SurveyDTO => ({
  question: 'any_question',
  answers:
    [
      {
        image: 'any_images',
        answer: 'any_answer'
      },
      {
        answer: 'another_answer'
      }
    ]
})

interface SutTypes {
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
})
