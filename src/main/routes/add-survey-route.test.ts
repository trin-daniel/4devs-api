import { MongoHelper } from '../../infra/database/mongo/helper/mongo-helper'
import app from '../config/app'
import supertest from 'supertest'

describe('Add Survey Route', () => {
  beforeAll(async () => await MongoHelper.connect(process.env.MONGO_URL))
  afterAll(async () => await MongoHelper.disconnect())
  beforeEach(async () => {
    const collection = await MongoHelper.collection('accounts')
    await collection.deleteMany({})
  })

  describe('#POST/Surveys', () => {
    test('Should return 204 on success', async () => {
      const data =
      {
        question: 'any_question',
        answers: [
          {
            answer: 'any_answer',
            image: 'any_image'
          }
        ]
      }
      await supertest(app)
        .post('/api/surveys')
        .send(data)
        .expect(204)
    })
  })
})
