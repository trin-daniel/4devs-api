import { MongoHelper } from '@infra/database/mongo/helper/mongo-helper'
import app from '@main/config/app'
import supertest from 'supertest'

describe('Survey Result Route', () => {
  beforeAll(async () => await MongoHelper.connect(process.env.MONGO_URL))
  afterAll(async () => await MongoHelper.disconnect())

  describe('#PUT/surveys', () => {
    test('Should return 403 if no token is provided', async () => {
      await supertest(app)
        .put('/api/surveys/any_id/results')
        .send({ answer: 'any_answer' })
        .expect(403)
    })
  })
})
