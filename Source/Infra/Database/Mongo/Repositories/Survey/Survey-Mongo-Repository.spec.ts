import { SurveyDTO } from '@Application/DTOS'
import { Surveys } from '@Application/Entities'
import { MongoHelper } from '@Infra/Database/Mongo/Helper/Mongo-Helper'
import { SurveyMongoRepository } from '@Infra/Database/Mongo/Repositories/Survey/Survey-Mongo-Repository'

const MockSurveyDTO = (): SurveyDTO => ({
  question: 'any_question',
  answers:
    [
      {
        image: 'any_images',
        answer: 'any_answer'
      }
    ],
  date: new Date().toLocaleDateString('pt-br')
})

const InsertSurvey = async () => {
  const Collection = await MongoHelper.collection('surveys')
  const { ops } = await Collection.insertOne(MockSurveyDTO())
  const [res] = ops
  const Survey = await MongoHelper.mapper(res)
  return Survey as Surveys
}

type SutTypes = {
  Sut: SurveyMongoRepository
}

const makeSut = (): SutTypes => {
  const Sut = new SurveyMongoRepository()
  return { Sut }
}

describe('Survey Mongo Repository', () => {
  beforeAll(async () => await MongoHelper.connect(process.env.MONGO_URL))
  afterAll(async () => await MongoHelper.disconnect())

  beforeEach(async () => {
    const Collection = await MongoHelper.collection('surveys')
    await Collection.deleteMany({})
  })

  describe('#AddSurveyRepository', () => {
    test('Should add a new survey when it is successful', async () => {
      const { Sut } = makeSut()
      await Sut.Add(MockSurveyDTO())
      const Collection = await MongoHelper.collection('surveys')
      const Survey = await Collection.findOne({ question: MockSurveyDTO().question })
      expect(Survey).toBeTruthy()
      expect(Survey).toHaveProperty('_id')
      expect(Survey).toHaveProperty('answers')
    })
  })

  describe('#LoadSurveysRepository', () => {
    test('Should return all surveys if loadAll is successful', async () => {
      const Collection = await MongoHelper.collection('surveys')
      await Collection.insertOne(MockSurveyDTO())
      const { Sut } = makeSut()
      const Surveys = await Sut.LoadAll()
      expect(Surveys.length).toBe(1)
      expect(Surveys[0]).toHaveProperty('id')
    })

    test('Should return an empty array if loadAll returns empty', async () => {
      const { Sut } = makeSut()
      const Surveys = await Sut.LoadAll()
      expect(Surveys.length).toBe(0)
    })
  })

  describe('#LoadSurveyByIdRepository', () => {
    test('Should return a survey if load by id is successful', async () => {
      const { id } = await InsertSurvey()
      const { Sut } = makeSut()
      const Survey = await Sut.LoadById(id)
      expect(Survey).toBeTruthy()
      expect(Survey).toHaveProperty('answers')
      expect(Survey).toHaveProperty('question')
    })
  })
})
