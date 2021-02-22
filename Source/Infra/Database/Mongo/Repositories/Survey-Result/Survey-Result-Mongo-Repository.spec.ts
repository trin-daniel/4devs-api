import { Account, SurveyResult, Surveys } from '@Application/Entities'
import { AccountDTO, SurveyDTO } from '@Application/DTOS'
import { MongoHelper } from '@Infra/Database/Mongo/Helper/Mongo-Helper'
import { SurveyResultRepository } from '@Infra/Database/Mongo/Repositories/Survey-Result/Survey-Result-Mongo-Repository'
import { ObjectId } from 'mongodb'

const MockAccountDTO = async (): Promise<AccountDTO> =>
  (
    {
      name: 'any_name',
      email: 'any_email@gmail.com',
      password: 'any_password'
    }
  )

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

const InsertSurvey = async () => {
  const Collection = await MongoHelper.collection('surveys')
  const { ops } = await Collection.insertOne(MockSurveyDTO())
  const [res] = ops
  const Survey = await MongoHelper.mapper(res)
  return Survey as Surveys
}

const InsertAccount = async () => {
  const Collection = await MongoHelper.collection('accounts')
  const { ops } = await Collection.insertOne(await MockAccountDTO())
  const [res] = ops
  const FormattedAccount = await MongoHelper.mapper(res) as Account
  return FormattedAccount
}

type SutTypes = {Sut: SurveyResultRepository}

const makeSut = (): SutTypes => {
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
    test('Should add a new survey result or update an existing survey result', async () => {
      const Account = await InsertAccount()
      const Survey = await InsertSurvey()
      const { Sut } = makeSut()
      const SurveyResult = await Sut.Save(
        {
          account_id: Account.id,
          answer: Survey.answers[0].answer,
          survey_id: Survey.id,
          date: new Date().toLocaleDateString('pt-br')
        }
      )
      expect(SurveyResult).toBeTruthy()
      expect(SurveyResult).toHaveProperty('survey_id')
      expect(SurveyResult.answers[0].answer).toBe(Survey.answers[0].answer)
      expect(SurveyResult.answers[0].count).toBe(1)
      expect(SurveyResult.answers[0].percent).toBe(100)
      expect(SurveyResult.answers[1].count).toBe(0)
      expect(SurveyResult.answers[1].percent).toBe(0)
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
      const { Sut } = makeSut()
      const SurveyResult = await Sut.Save(
        {
          account_id: Account.id,
          answer: Survey.answers[1].answer,
          survey_id: Survey.id,
          date: new Date().toLocaleDateString('pt-br')
        }
      )
      expect(SurveyResult).toBeTruthy()
      expect(SurveyResult).toHaveProperty('survey_id')
      expect(SurveyResult.answers[0].answer).toBe(Survey.answers[1].answer)
      expect(SurveyResult.answers[0].count).toBe(1)
      expect(SurveyResult.answers[0].percent).toBe(100)
      expect(SurveyResult.answers[1].count).toBe(0)
      expect(SurveyResult.answers[1].percent).toBe(0)
    })
  })
})
