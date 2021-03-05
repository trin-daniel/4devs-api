import { AccountDTO } from '@Application/DTOS'
import { MongoHelper } from '@Infra/Database/Mongo/Helper/Mongo-Helper'
import { AccountMongoRepository } from '@Infra/Database/Mongo/Repositories/Account/Account-Mongo-Repository'
import Faker from 'faker'

interface SutTypes {
  Sut: AccountMongoRepository
}

const HASHED_PASSWORD = Faker.internet.password()
const EXPECTED_TOKEN = Faker.random.uuid()
const MockAccount = (): AccountDTO =>
  (
    {
      name: Faker.internet.userName(),
      email: Faker.internet.email(),
      password: HASHED_PASSWORD
    }
  )
const MOCK_ACCOUNT_INSTANCE = MockAccount()
const MakeSut = (): SutTypes => {
  const Sut = new AccountMongoRepository()
  return { Sut }
}

describe('Account Repository', () => {
  beforeAll(async () => await MongoHelper.connect(process.env.MONGO_URL))

  afterAll(async () => await MongoHelper.disconnect())

  beforeEach(async () => {
    const Collection = await MongoHelper.collection('accounts')
    await Collection.deleteMany({})
  })

  describe('#AddAccountRepository', () => {
    test('Should return an account on success', async () => {
      const { Sut } = MakeSut()
      const Account = await Sut.Add(MOCK_ACCOUNT_INSTANCE)
      expect(Account).toBeTruthy()
      expect(Account.id).toBeTruthy()
      expect(Account.name).toBe(MOCK_ACCOUNT_INSTANCE.name)
      expect(Account.email).toBe(MOCK_ACCOUNT_INSTANCE.email)
    })
  })

  describe('#LoadAccountByEmailRepository', () => {
    test('Should return an account if load by e-mail address succeeds', async () => {
      const { Sut } = MakeSut()
      const Collection = await MongoHelper.collection('accounts')
      await Collection.insertOne(MOCK_ACCOUNT_INSTANCE)
      const Account = await Sut.LoadByEmail(MOCK_ACCOUNT_INSTANCE.email)
      expect(Account).toBeTruthy()
      expect(Account).toHaveProperty('id')
      expect(Account).toHaveProperty('name')
    })

    test('Should return null if load by e-mail address return null', async () => {
      const { Sut } = MakeSut()
      const { email } = MockAccount()
      const Account = await Sut.LoadByEmail(email)
      expect(Account).toBeNull()
    })
  })

  describe('#UpdateTokenRepository', () => {
    test('Should update the account token if updateToken is successful', async () => {
      const { Sut } = MakeSut()
      const Collection = await MongoHelper.collection('accounts')
      const { ops } = await Collection.insertOne(MOCK_ACCOUNT_INSTANCE)
      const [Account] = ops
      const FormattedAccount = MongoHelper.mapper(Account)
      const { id } = FormattedAccount
      expect(Account).not.toHaveProperty('token')
      await Sut.UpdateToken(id, EXPECTED_TOKEN)
      const Result = await Collection.findOne({ _id: id })
      expect(Result.token).toBe(EXPECTED_TOKEN)
    })
  })

  describe('#LoadAccountByTokenRepository', () => {
    test('Should return an account if admin role are not provided', async () => {
      const { Sut } = MakeSut()
      const Account =
      {
        token: EXPECTED_TOKEN,
        ...MOCK_ACCOUNT_INSTANCE
      }
      const Collection = await MongoHelper.collection('accounts')
      await Collection.insertOne(Account)
      const ExpectedAccount = await Sut.LoadByToken(Account.token)
      expect(ExpectedAccount).toBeTruthy()
      expect(ExpectedAccount).toHaveProperty('id')
    })

    test('Should return an account if admin role are provided', async () => {
      const { Sut } = MakeSut()
      const Account =
      {
        token: EXPECTED_TOKEN,
        ...MOCK_ACCOUNT_INSTANCE,
        role: 'admin'
      }
      const Collection = await MongoHelper.collection('accounts')
      await Collection.insertOne(Account)
      const ExpectedAccount = await Sut.LoadByToken(Account.token, Account.role)
      expect(ExpectedAccount).toBeTruthy()
      expect(ExpectedAccount).toHaveProperty('id')
    })

    test('Should return null if the admin role is wrong or is not provided', async () => {
      const { Sut } = MakeSut()
      const Account =
      {
        token: EXPECTED_TOKEN,
        ...MOCK_ACCOUNT_INSTANCE
      }
      const Collection = await MongoHelper.collection('accounts')
      await Collection.insertOne(Account)
      const ExpectedAccount = await Sut.LoadByToken(Account.token, 'another_role')
      expect(ExpectedAccount).toBeNull()
    })

    test('Should allow the admin to access any route if the admin role is provided', async () => {
      const { Sut } = MakeSut()
      const Account =
      {
        token: EXPECTED_TOKEN,
        ...MOCK_ACCOUNT_INSTANCE,
        role: 'admin'
      }
      const Collection = await MongoHelper.collection('accounts')
      await Collection.insertOne(Account)
      const ExpectedAccount = await Sut.LoadByToken(Account.token)
      expect(ExpectedAccount).toBeTruthy()
      expect(ExpectedAccount).toHaveProperty('id')
    })

    test('Should return null if load by token returns null', async () => {
      const { Sut } = MakeSut()
      const Account = await Sut.LoadByToken(EXPECTED_TOKEN, 'another_role')
      expect(Account).toBeNull()
    })
  })
})
