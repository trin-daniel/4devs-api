import { MongoHelper } from '@Infra/Database/Mongo/Helper/Mongo-Helper'
import App from '@Main/Config/App'
import Supertest from 'supertest'
import Faker from 'faker'

describe('SignUp Route', () => {
  beforeAll(async () => await MongoHelper.connect(process.env.MONGO_URL))
  afterAll(async () => await MongoHelper.disconnect())

  beforeEach(async () => {
    const Collection = await MongoHelper.collection('accounts')
    await Collection.deleteMany({})
  })

  describe('#POST/SignUp', () => {
    test('Should return 200 when adding account successfully', async () => {
      const PASSWORD_FREZEED = Faker.internet.password()
      const AccountDTO =
      {
        name: Faker.internet.userName(),
        email: Faker.internet.email(),
        password: PASSWORD_FREZEED,
        confirmation: PASSWORD_FREZEED
      }

      await Supertest(App)
        .post('/api/sign-up')
        .send(AccountDTO)
        .expect(200)
    })
  })
})
