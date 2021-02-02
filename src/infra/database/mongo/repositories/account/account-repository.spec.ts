import { AccountRepository } from './account-repository'
import { MongoHelper } from '../../helper/mongo-helper'

interface SutTypes {
  sut: AccountRepository
}

const makeSut = (): SutTypes => {
  const sut = new AccountRepository()
  return { sut }
}

describe('Account Repository', () => {
  beforeAll(async () => await MongoHelper.connect(process.env.MONGO_URL))

  afterAll(async () => await MongoHelper.disconnect())

  beforeEach(async () => {
    const collection = await MongoHelper.collection('accounts')
    await collection.deleteMany({})
  })

  describe('#AddAccountRepository', () => {
    test('Should return an account on success', async () => {
      const { sut } = makeSut()
      const data =
      {
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'hash'
      }
      const account = await sut.add(data)
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe('any_name')
      expect(account.email).toBe('any_email@gmail.com')
    })
  })

  describe('#LoadAccountByEmailRepository', () => {
    test('Should return an account if load by e-mail address succeeds', async () => {
      const { sut } = makeSut()
      const data =
      {
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'hash'
      }
      const collection = await MongoHelper.collection('accounts')
      await collection.insertOne(data)
      const account = await sut.loadByEmail('any_email@gmail.com')
      expect(account).toBeTruthy()
      expect(account.id).toHaveProperty('id')
      expect(account).toHaveProperty('name')
    })

    test('Should return null if load by e-mail address return null', async () => {
      const { sut } = makeSut()
      const account = await sut.loadByEmail('any_email@gmail.com')
      expect(account).toBeNull()
    })
  })
})
