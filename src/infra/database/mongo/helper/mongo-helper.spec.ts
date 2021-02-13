import { MongoHelper as sut } from '@infra/database/mongo/helper/mongo-helper'

describe('Mongo Helper', () => {
  beforeAll(async () => await sut.connect(process.env.MONGO_URL))
  afterAll(async () => await sut.disconnect())
  test('Should reconnect to the database if the connection is broken', async () => {
    {
      const collection = await sut.collection('accounts')
      expect(collection).toBeTruthy()
    }

    {
      await sut.disconnect()
      const collection = await sut.collection('accounts')
      expect(collection).toBeTruthy()
    }
  })
})
