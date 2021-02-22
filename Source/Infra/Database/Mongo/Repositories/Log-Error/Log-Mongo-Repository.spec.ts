import { MongoHelper } from '@Infra/Database/Mongo/Helper/Mongo-Helper'
import { LogMongoRepository } from '@Infra/Database/Mongo/Repositories/Log-Error/Log-Mongo-Repository'
import { LogErrorRepository } from '@Data/Protocols/Database'

type SutTypes = {Sut: LogErrorRepository}

const makeSut = (): SutTypes => {
  const Sut = new LogMongoRepository()
  return { Sut }
}

describe('Log Mongo Repository', () => {
  beforeAll(async () => await MongoHelper.connect(process.env.MONGO_URL))
  afterAll(async () => await MongoHelper.disconnect())

  beforeEach(async () => {
    const Collection = await MongoHelper.collection('errors')
    await Collection.deleteMany({})
  })

  test('Should create an error log on success', async () => {
    const { Sut } = makeSut()
    await Sut.LogError('An unexpected error has occurred')
    const Collection = await MongoHelper.collection('error')
    const ExpectedData = await Collection.findOne({ error: 'An unexpected error has occurred' })
    expect(ExpectedData.error).toBe('An unexpected error has occurred')
  })
})
