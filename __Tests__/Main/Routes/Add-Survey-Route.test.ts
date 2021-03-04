import { Account } from '@Application/Entities'
import { AccountDTO, SurveyDTO } from '@Application/DTOS'
import { MongoHelper } from '@Infra/Database/Mongo/Helper/Mongo-Helper'
import App from '@Main/Config/App'
import Env from '@Main/Config/Env'
import Bcrypt from 'bcrypt'
import JsonWebToken from 'jsonwebtoken'
import Supertest from 'supertest'
import Faker from 'faker'

const EXPECTED_TOKEN = Faker.random.uuid()
const MockSurveyDTO = (): Omit<SurveyDTO, 'date'> => ({
  question: Faker.lorem.paragraph(1),
  answers:
  [
    {
      image: Faker.image.imageUrl(),
      answer: Faker.random.word()
    }
  ]
})
const MOCK_SURVEY_DTO_INSTANCE = MockSurveyDTO()
const MockAccountDTO = async (): Promise<AccountDTO & {role: 'admin'}> =>
  ({
    name: Faker.internet.userName(),
    email: Faker.internet.email(),
    password: await Bcrypt.hash('any_password', 12),
    role: 'admin'
  })
const MOCK_ACCOUNT_DTO_INSTANCE = MockAccountDTO()
const InsertAccount = async () => {
  const Collection = await MongoHelper.collection('accounts')
  const { ops } = await Collection.insertOne(await MOCK_ACCOUNT_DTO_INSTANCE)
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
        .send(MOCK_SURVEY_DTO_INSTANCE)
        .expect(403)
    })

    test('Should return 204 if valid token is provided', async () => {
      const collection = await MongoHelper.collection('accounts')
      const { id } = await InsertAccount()
      const token = JsonWebToken.sign(EXPECTED_TOKEN, Env.SECRET_KEY)
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
