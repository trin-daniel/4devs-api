import { AccountDTO } from '@Application/DTOS'
import App from '@Main/Config/App'
import { MongoHelper } from '@Infra/Database/Mongo/Helper/Mongo-Helper'
import Supertest from 'supertest'
import Bcrypt from 'bcrypt'
import Faker from 'faker'

const PASSWORD_FREZEED = Faker.internet.password()
const MockAccountDTO = async (): Promise<AccountDTO> =>
  (
    {
      name: Faker.internet.userName(),
      email: Faker.internet.email(),
      password: await Bcrypt.hash(PASSWORD_FREZEED, 12)
    }
  )
const MOCK_ACCOUNT_DTO_INSTANCE = MockAccountDTO()

describe('SignIn Route', () => {
  beforeAll(async () => await MongoHelper.connect(process.env.MONGO_URL))
  afterAll(async () => await MongoHelper.disconnect())
  beforeEach(async () => {
    const Collection = await MongoHelper.collection('accounts')
    await Collection.deleteMany({})
  })

  describe('#POST/SignIn', () => {
    test('Should return 200 if authentication succeeds', async () => {
      const Collection = await MongoHelper.collection('accounts')
      const AccountDTO = await MOCK_ACCOUNT_DTO_INSTANCE
      await Collection.insertOne(AccountDTO)
      await Supertest(App)
        .post('/api/sign-in')
        .send(
          {
            email: AccountDTO.email,
            password: PASSWORD_FREZEED
          }
        )
        .expect(200)
    })

    test('Should return 401 if invalid credentials are provided', async () => {
      const AccountDTO = await MOCK_ACCOUNT_DTO_INSTANCE
      await Supertest(App)
        .post('/api/sign-in')
        .send(
          {
            email: AccountDTO.email,
            password: AccountDTO.password
          }
        )
        .expect(401)
    })
  })
})
