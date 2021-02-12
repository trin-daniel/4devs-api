import supertest from 'supertest'
import app from '../config/app'
describe('Load Surveys Route', () => {
  describe('#GET/surveys', () => {
    test('Should return 403 if no token is provided', async () => {
      await supertest(app)
        .get('/api/surveys')
        .expect(403)
    })
  })
})
