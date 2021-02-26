import { MongoHelper } from '@Infra/Database/Mongo/Helper/Mongo-Helper'
import { AccountMongoRepository } from '@Infra/Database/Mongo/Repositories/Account/Account-Mongo-Repository'

type SutTypes = {Sut: AccountMongoRepository}

const makeSut = (): SutTypes => {
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
      const { Sut } = makeSut()
      const Data =
      {
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'hash'
      }
      const Account = await Sut.Add(Data)
      expect(Account).toBeTruthy()
      expect(Account.id).toBeTruthy()
      expect(Account.name).toBe('any_name')
      expect(Account.email).toBe('any_email@gmail.com')
    })
  })

  describe('#LoadAccountByEmailRepository', () => {
    test('Should return an account if load by e-mail address succeeds', async () => {
      const { Sut } = makeSut()
      const data =
      {
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'hash'
      }
      const Collection = await MongoHelper.collection('accounts')
      await Collection.insertOne(data)
      const Account = await Sut.LoadByEmail('any_email@gmail.com')
      expect(Account).toBeTruthy()
      expect(Account.id).toHaveProperty('id')
      expect(Account).toHaveProperty('name')
    })

    test('Should return null if load by e-mail address return null', async () => {
      const { Sut } = makeSut()
      const Account = await Sut.LoadByEmail('any_email@gmail.com')
      expect(Account).toBeNull()
    })
  })

  describe('#UpdateTokenRepository', () => {
    test('Should update the account token if updateToken is successful', async () => {
      const { Sut } = makeSut()
      const Data =
      {
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'hash'
      }
      const Collection = await MongoHelper.collection('accounts')
      const { ops } = await Collection.insertOne(Data)
      const [Account] = ops
      const { _id } = Account
      expect(Account).not.toHaveProperty('token')
      await Sut.UpdateToken(_id, 'any_token')
      const Result = await Collection.findOne({ _id })
      expect(Result.token).toBe('any_token')
    })
  })

  describe('#LoadAccountByTokenRepository', () => {
    test('Should return an account if admin role are not provided', async () => {
      const { Sut } = makeSut()
      const Data =
      {
        token: 'any_token',
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'hash'
      }
      const Collection = await MongoHelper.collection('accounts')
      await Collection.insertOne(Data)
      const Account = await Sut.LoadByToken(Data.token)
      expect(Account).toBeTruthy()
      expect(Account).toHaveProperty('id')
      expect(Account).toHaveProperty('name')
    })

    test('Should return an account if admin role are provided', async () => {
      const { Sut } = makeSut()
      const Data =
      {
        token: 'any_token',
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'hash',
        role: 'admin'
      }
      const Collection = await MongoHelper.collection('accounts')
      await Collection.insertOne(Data)
      const Account = await Sut.LoadByToken(Data.token, Data.role)
      expect(Account).toBeTruthy()
      expect(Account).toHaveProperty('id')
      expect(Account).toHaveProperty('name')
    })

    test('Should return null if the admin role is wrong or is not provided', async () => {
      const { Sut } = makeSut()
      const Data =
      {
        token: 'any_token',
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'hash'
      }
      const Collection = await MongoHelper.collection('accounts')
      await Collection.insertOne(Data)
      const Account = await Sut.LoadByToken(Data.token, 'any_role')
      expect(Account).toBeNull()
    })

    test('Should allow the admin to access any route if the admin role is provided', async () => {
      const { Sut } = makeSut()
      const Data =
      {
        token: 'any_token',
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'hash',
        role: 'admin'
      }
      const Collection = await MongoHelper.collection('accounts')
      await Collection.insertOne(Data)
      const Account = await Sut.LoadByToken(Data.token)
      expect(Account).toBeTruthy()
      expect(Account).toHaveProperty('token')
    })

    test('Should return null if load by token returns null', async () => {
      const { Sut } = makeSut()
      const Account = await Sut.LoadByToken('any_token', 'any_role')
      expect(Account).toBeNull()
    })
  })
})
