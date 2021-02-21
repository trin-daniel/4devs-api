import { MongoHelper } from '@Infra/Database/Mongo/Helper/Mongo-Helper'
import App from '@Main/Config/App'
import Supertest from 'supertest'

describe('SignUp Route', () => {
  beforeAll(async () => await MongoHelper.connect(process.env.MONGO_URL))
  afterAll(async () => await MongoHelper.disconnect())

  beforeEach(async () => {
    const Collection = await MongoHelper.collection('accounts')
    await Collection.deleteMany({})
  })

  describe('#POST/SignUp', () => {
    test('Should return 200 when adding account successfully', async () => {
      const Data =
      {
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'any_password',
        confirmation: 'any_password'
      }

      await Supertest(App)
        .post('/api/sign-up')
        .send(Data)
        .expect(200)
    })
  })
})
