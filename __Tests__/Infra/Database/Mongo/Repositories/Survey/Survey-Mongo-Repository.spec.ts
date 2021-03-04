import { AccountDTO, SurveyDTO } from '@Application/DTOS'
import { Account, Surveys } from '@Application/Entities'
import { MongoHelper } from '@Infra/Database/Mongo/Helper/Mongo-Helper'
import { SurveyMongoRepository } from '@Infra/Database/Mongo/Repositories/Survey/Survey-Mongo-Repository'
import Bcrypt from 'bcrypt'
import Faker from 'faker'

const MockSurveyDTO = async (): Promise<SurveyDTO> =>
  (
    {
      question: Faker.lorem.lines(1),
      answers:
    [
      {
        image: Faker.image.imageUrl(),
        answer: Faker.random.word()
      },
      {
        image: Faker.image.imageUrl(),
        answer: Faker.random.word()
      }
    ],
      date: new Date().toLocaleDateString('pt-br')
    }
  )

const ENTRY_PASSWORD = Faker.internet.password()
const MockAccountDTO = async (): Promise<AccountDTO> =>
  (
    {
      name: Faker.internet.userName(),
      email: Faker.internet.email(),
      password: await Bcrypt.hash(ENTRY_PASSWORD, 12)
    }
  )

const InsertAccount = async () => {
  const Collection = await MongoHelper.collection('accounts')
  const { ops } = await Collection.insertOne(await MockAccountDTO())
  const [res] = ops
  const FormattedAccount = await MongoHelper.mapper(res) as Account
  return FormattedAccount
}

const InsertSurvey = async () => {
  const Collection = await MongoHelper.collection('surveys')
  const { ops } = await Collection.insertOne(await MockSurveyDTO())
  const [res] = ops
  const Survey = await MongoHelper.mapper(res)
  return Survey as Surveys
}

interface SutTypes {
  Sut: SurveyMongoRepository
}

const MakeSut = (): SutTypes => {
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
      const { Sut } = MakeSut()
      const MockSurveyDTOInstance = await MockSurveyDTO()
      await Sut.Add(MockSurveyDTOInstance)
      const Collection = await MongoHelper.collection('surveys')
      const Survey = await Collection.findOne({ question: MockSurveyDTOInstance.question })
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
      const { Sut } = MakeSut()
      const Surveys = await Sut.LoadAll(Account.id)
      expect(Surveys.length).toBe(2)
      expect(Surveys[0]).toHaveProperty('id')
      expect(Surveys[1].question).toBe(Survey[1].question)
      expect(Surveys[1].didAnswer).toBe(false)
    })

    test('Should return an empty array if loadAll returns empty', async () => {
      const Account = await InsertAccount()
      const { Sut } = MakeSut()
      const Surveys = await Sut.LoadAll(Account.id)
      expect(Surveys.length).toBe(0)
    })
  })

  describe('#LoadSurveyByIdRepository', () => {
    test('Should return a survey if load by id is successful', async () => {
      const { id } = await InsertSurvey()
      const { Sut } = MakeSut()
      const Survey = await Sut.LoadById(id)
      expect(Survey).toBeTruthy()
      expect(Survey).toHaveProperty('answers')
      expect(Survey).toHaveProperty('question')
    })
  })
})
