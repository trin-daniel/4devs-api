import { AccountRepository } from './account-repository'
import { MongoHelper } from '../../helper/mongo-helper'

describe('Account Repository', () => {
  beforeAll(async () => await MongoHelper.connect(process.env.MONGO_URL))

  afterAll(async () => MongoHelper.disconnect())

  test('Should return an account on success', async () => {
    const sut = new AccountRepository()
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
