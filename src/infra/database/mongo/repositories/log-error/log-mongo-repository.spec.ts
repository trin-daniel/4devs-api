import { MongoHelper } from '@infra/database/mongo/helper/mongo-helper'
import { LogMongoRepository } from '@infra/database/mongo/repositories/log-error/log-mongo-repository'
import { LogErrorRepository } from '@data/contracts'

type SutTypes = {
  sut: LogErrorRepository
}
const makeSut = (): SutTypes => {
  const sut = new LogMongoRepository()
  return { sut }
}

describe('Log Mongo Repository', () => {
  beforeAll(async () => await MongoHelper.connect(process.env.MONGO_URL))
  afterAll(async () => await MongoHelper.disconnect())

  beforeEach(async () => {
    const collection = await MongoHelper.collection('errors')
    await collection.deleteMany({})
  })

  test('Should create an error log on success', async () => {
    const { sut } = makeSut()
    await sut.logError('An unexpected error has occurred')
    const collection = await MongoHelper.collection('error')
    const expectedData = await collection.findOne({ error: 'An unexpected error has occurred' })
    expect(expectedData.error).toBe('An unexpected error has occurred')
  })
})
