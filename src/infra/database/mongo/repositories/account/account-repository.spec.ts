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

  beforeEach(async () => await MongoHelper.collection('accounts').deleteMany({}))

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
