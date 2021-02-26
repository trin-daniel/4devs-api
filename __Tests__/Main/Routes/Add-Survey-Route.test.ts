import { Account } from '@Application/Entities'
import { AccountDTO, SurveyDTO } from '@Application/DTOS'
import { MongoHelper } from '@Infra/Database/Mongo/Helper/Mongo-Helper'
import App from '@Main/Config/App'
import Env from '@Main/Config/Env'
import Bcrypt from 'bcrypt'
import JsonWebToken from 'jsonwebtoken'
import Supertest from 'supertest'

const MockSurveyDTO = (): Omit<SurveyDTO, 'date'> => ({
  question: 'any_question',
  answers:
  [
    {
      image: 'any_images',
      answer: 'any_answer'
    }
  ]
})

type AccountWithRole = AccountDTO & {role: 'admin'}

const MockAccountDTO = async (): Promise<AccountWithRole> =>
  ({
    name: 'any_name',
    email: 'any_email@gmail.com',
    password: await Bcrypt.hash('any_password', 12),
    role: 'admin'
  })

const insertAccount = async () => {
  const Collection = await MongoHelper.collection('accounts')
  const { ops } = await Collection.insertOne(await MockAccountDTO())
  const [res] = ops
  const Account = await MongoHelper.mapper(res) as Account

  return Account
}

describe('Add Survey Route', () => {
  beforeAll(async () => await MongoHelper.connect(process.env.MONGO_URL))
  afterAll(async () => await MongoHelper.disconnect())
  beforeEach(async () => {
    const Collection = await MongoHelper.collection('accounts')
    const SurveysCollection = await MongoHelper.collection('surveys')
    await Collection.deleteMany({})
    await SurveysCollection.deleteMany({})
  })

  describe('#POST/Surveys', () => {
    test('Should return 403 if no token is provided', async () => {
      await Supertest(App)
        .post('/api/surveys')
        .send(MockSurveyDTO())
        .expect(403)
    })

    test('Should return 204 if valid token is provided', async () => {
      const collection = await MongoHelper.collection('accounts')
      const { id } = await insertAccount()
      const token = JsonWebToken.sign('any_token', Env.SECRET_KEY)
      await collection.updateOne(
        { _id: id },
        { $set: { token } }
      )
      await Supertest(App)
        .post('/api/surveys')
        .set('x-access-token', token)
        .send(MockSurveyDTO())
        .expect(204)
    })
  })
})
