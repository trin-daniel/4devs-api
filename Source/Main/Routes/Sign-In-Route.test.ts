import App from '@Main/Config/App'
import { MongoHelper } from '@Infra/Database/Mongo/Helper/Mongo-Helper'
import Supertest from 'supertest'
import Bcrypt from 'bcrypt'

describe('Signin Route', () => {
  beforeAll(async () => await MongoHelper.connect(process.env.MONGO_URL))
  afterAll(async () => await MongoHelper.disconnect())
  beforeEach(async () => {
    const Collection = await MongoHelper.collection('accounts')
    await Collection.deleteMany({})
  })

  describe('#POST/SignIn', () => {
    test('Should return 200 if authentication succeeds', async () => {
      const Collection = await MongoHelper.collection('accounts')
      const Data =
      {
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: await Bcrypt.hash('any_password', 12)
      }
      await Collection.insertOne(Data)
      await Supertest(App)
        .post('/api/sign-in')
        .send(
          {
            email: 'any_email@gmail.com',
            password: 'any_password'
          }
        )
        .expect(200)
    })

    test('Should return 401 if invalid credentials are provided', async () => {
      await Supertest(App)
        .post('/api/sign-in')
        .send(
          {
            email: 'any_email@gmail.com',
            password: 'any_password'
          }
        )
        .expect(401)
    })
  })
})
