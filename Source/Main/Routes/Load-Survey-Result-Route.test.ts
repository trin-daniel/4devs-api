import App from '@Main/Config/App'
import Supertest from 'supertest'

describe('Load Survey Result Route', () => {
  describe('#GET/Surveys', () => {
    test('Should return 403 if no token is provided', async () => {
      await Supertest(App)
        .get('/api/surveys/any_id/results')
        .expect(403)
    })
  })
})
