import { noCache } from '@Main/Middlewares/No-Cache'
import app from '@Main/Config/App'
import supertest from 'supertest'

describe('Nocache middleware', () => {
  test('Should disable cache', async () => {
    app.get('/test_cache', noCache, (request, response, next) => {
      response.send()
      next()
    })

    await supertest(app)
      .get('/test_cache')
      .expect('cache-control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
      .expect('pragma', 'no-cache')
      .expect('expires', '0')
      .expect('surrogate-control', 'no-store')
  })
})
