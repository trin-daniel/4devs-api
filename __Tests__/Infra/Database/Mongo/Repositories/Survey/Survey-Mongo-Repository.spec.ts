import { AccountDTO, SurveyDTO } from '@Application/DTOS'
import { Account, Surveys } from '@Application/Entities'
import { MongoHelper } from '@Infra/Database/Mongo/Helper/Mongo-Helper'
import { SurveyMongoRepository } from '@Infra/Database/Mongo/Repositories/Survey/Survey-Mongo-Repository'
import Bcrypt from 'bcrypt'

const MockSurveyDTO = (): SurveyDTO => ({
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
  date: new Date().toLocaleDateString('pt-br')
})

const MockAccountDTO = async (): Promise<AccountDTO> =>
  ({
    name: 'any_name',
    email: 'any_email@gmail.com',
    password: await Bcrypt.hash('any_password', 12)
  })

const InsertAccount = async () => {
  const Collection = await MongoHelper.collection('accounts')
  const { ops } = await Collection.insertOne(await MockAccountDTO())
  const [res] = ops
  const FormattedAccount = await MongoHelper.mapper(res) as Account
  return FormattedAccount
}

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
    const SurveyCollection = await MongoHelper.collection('surveys')
    await SurveyCollection.deleteMany({})

    const AccountCollection = await MongoHelper.collection('accounts')
    await AccountCollection.deleteMany({})

    const SurveyResultCollection = await MongoHelper.collection('survey-results')
    await SurveyResultCollection.deleteMany({})
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
      const Account = await InsertAccount()
      const Survey = [await InsertSurvey(), await InsertSurvey()]
      const SurveyResultCollection = await MongoHelper.collection('survey-results')

      await SurveyResultCollection.insertOne({
        account_id: Account.id,
        answer: Survey[0].answers[0].answer,
        survey_id: Survey[0].id,
        date: new Date().toLocaleDateString('pt-br')
      })
      const { Sut } = makeSut()
      const Surveys = await Sut.LoadAll(Account.id)
      expect(Surveys.length).toBe(2)
      expect(Surveys[0]).toHaveProperty('id')
      expect(Surveys[1].question).toBe(Survey[1].question)
      expect(Surveys[1].didAnswer).toBe(false)
    })

    test('Should return an empty array if loadAll returns empty', async () => {
      const Account = await InsertAccount()
      const { Sut } = makeSut()
      const Surveys = await Sut.LoadAll(Account.id)
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
