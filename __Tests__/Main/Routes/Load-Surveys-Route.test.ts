import { AccountDTO, SurveyDTO } from '@Application/DTOS'
import { Account, Surveys } from '@Application/Entities'
import { MongoHelper } from '@Infra/Database/Mongo/Helper/Mongo-Helper'
import App from '@Main/Config/App'
import Env from '@Main/Config/Env'
import Supertest from 'supertest'
import Jsonwebtoken from 'jsonwebtoken'
import Bcrypt from 'bcrypt'

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

const MockAccountDTO = async (): Promise<AccountDTO> =>
  ({
    name: 'any_name',
    email: 'any_email@gmail.com',
    password: await Bcrypt.hash('any_password', 12)
  })

const InsertSurvey = async () => {
  const collection = await MongoHelper.collection('surveys')
  const { ops } = await collection.insertOne(MockSurveyDTO())
  const [res] = ops
  return res as Surveys
}

const InsertAccount = async () => {
  const Collection = await MongoHelper.collection('accounts')
  const { ops } = await Collection.insertOne(await MockAccountDTO())
  const [res] = ops
  const FormattedAccount = await MongoHelper.mapper(res) as Account
  return FormattedAccount
}

describe('Load Surveys Route', () => {
  beforeAll(async () => await MongoHelper.connect(process.env.MONGO_URL))
  afterAll(async () => await MongoHelper.disconnect())
  beforeEach(async () => {
    const Collection = await MongoHelper.collection('accounts')
    await Collection.deleteMany({})
    const SurveysCollection = await MongoHelper.collection('surveys')
    await SurveysCollection.deleteMany({})
  })

  describe('#GET/Surveys', () => {
    test('Should return 403 if no token is provided', async () => {
      await Supertest(App)
        .get('/api/surveys')
        .expect(403)
    })

    test('Should return 200 if a valid token is provided', async () => {
      const Account = await InsertAccount()
      await InsertSurvey()
      const Collection = await MongoHelper.collection('accounts')
      const Token = Jsonwebtoken.sign('any_token', Env.SECRET_KEY)
      await Collection.updateOne(
        { _id: Account.id },
        { $set: { token: Token } }
      )
      await Supertest(App)
        .get('/api/surveys')
        .set('x-access-token', Token)
        .expect(200)
    })
  })
})
