import { Account, Surveys } from '@Application/Entities'
import { AccountDTO, SurveyDTO } from '@Application/DTOS'
import { MongoHelper } from '@Infra/Database/Mongo/Helper/Mongo-Helper'
import { SurveyResultRepository } from '@Infra/Database/Mongo/Repositories/Survey-Result/Survey-Result-Mongo-Repository'
import { ObjectId } from 'mongodb'
import Faker from 'faker'
import Bcrypt from 'bcrypt'

const ENTRY_PASSWORD = Faker.internet.password()
const MockAccountDTO = async (): Promise<AccountDTO> =>
  (
    {
      name: Faker.internet.userName(),
      email: Faker.internet.email(),
      password: await Bcrypt.hash(ENTRY_PASSWORD, 12)
    }
  )
const MockSurveyDTO = (): SurveyDTO =>
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

const InsertSurvey = async (): Promise<Surveys> => {
  const Collection = await MongoHelper.collection('surveys')
  const { ops } = await Collection.insertOne(MockSurveyDTO())
  const [res] = ops
  const Survey = await MongoHelper.mapper(res)
  return Survey as Surveys
}

const InsertAccount = async (): Promise<Account> => {
  const Collection = await MongoHelper.collection('accounts')
  const { ops } = await Collection.insertOne(await MockAccountDTO())
  const [res] = ops
  const FormattedAccount = await MongoHelper.mapper(res) as Account
  return FormattedAccount
}

interface SutTypes {
  Sut: SurveyResultRepository
}

const MakeSut = (): SutTypes => {
  const Sut = new SurveyResultRepository()
  return { Sut }
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
    test('Should add a new survey result', async () => {
      const Account = await InsertAccount()
      const Survey = await InsertSurvey()
      const { Sut } = MakeSut()
      await Sut.Save(
        {
          account_id: Account.id,
          answer: Survey.answers[0].answer,
          survey_id: Survey.id,
          date: new Date().toLocaleDateString('pt-br')
        }
      )
      const Collection = await MongoHelper.collection('survey-results')
      const SurveyResult = await Collection.findOne({ account_id: Account.id, survey_id: Survey.id })
      expect(SurveyResult).toBeTruthy()
      expect(SurveyResult).toHaveProperty('survey_id')
    })

    test('Should update the survey result if it already exists', async () => {
      const Account = await InsertAccount()
      const Survey = await InsertSurvey()
      const InsertSurveyResult = await MongoHelper.collection('survey-results')
      await InsertSurveyResult.insertOne(
        {
          account_id: new ObjectId(Account.id),
          answer: Survey.answers[0].answer,
          survey_id: new ObjectId(Survey.id),
          date: new Date().toLocaleDateString('pt-br')
        }
      )
      const { Sut } = MakeSut()
      await Sut.Save(
        {
          account_id: Account.id,
          answer: Survey.answers[1].answer,
          survey_id: Survey.id,
          date: new Date().toLocaleDateString('pt-br')
        }
      )
      const Collection = await MongoHelper.collection('survey-results')
      const SurveyResult = await Collection
        .find(
          {
            account_id: Account.id,
            survey_id: Survey.id
          })
        .toArray()
      expect(SurveyResult).toBeTruthy()
      expect(SurveyResult[0]).toHaveProperty('survey_id')
      expect(SurveyResult.length).toBe(1)
    })
  })

  describe('#LoadSurveyResultRespository', () => {
    test('Should return a SurveyResult if LoadBySurveyId succeeds', async () => {
      const Account = await InsertAccount()
      const Account2 = await InsertAccount()
      const Survey = await InsertSurvey()
      const InsertSurveyResult = await MongoHelper.collection('survey-results')
      await InsertSurveyResult.insertMany(
        [{
          account_id: new ObjectId(Account.id),
          answer: Survey.answers[0].answer,
          survey_id: new ObjectId(Survey.id),
          date: new Date().toLocaleDateString('pt-br')
        },
        {
          account_id: new ObjectId(Account2.id),
          answer: Survey.answers[0].answer,
          survey_id: new ObjectId(Survey.id),
          date: new Date().toLocaleDateString('pt-br')
        }]
      )
      const { Sut } = MakeSut()
      const SurveyResult = await Sut.LoadBySurveyId(Survey.id, Account.id)
      expect(SurveyResult).toBeTruthy()
      expect(SurveyResult).toHaveProperty('survey_id')
      expect(SurveyResult.answers[0].count).toBe(2)
      expect(SurveyResult.answers[0].percent).toBe(100)
      expect(SurveyResult.answers[0].isCurrentAccountAnswer).toBe(true)
      expect(SurveyResult.answers[1].count).toBe(0)
      expect(SurveyResult.answers[1].percent).toBe(0)
      expect(SurveyResult.answers[1].isCurrentAccountAnswer).toBe(false)
    })

    test('Should return null if LoadBySurveyId not find survey results', async () => {
      const Survey = await InsertSurvey()
      const Account = await InsertAccount()
      const { Sut } = MakeSut()
      const SurveyResult = await Sut.LoadBySurveyId(Survey.id, Account.id)
      expect(SurveyResult).toBeNull()
    })
  })
})
