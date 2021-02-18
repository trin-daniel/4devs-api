import { noCache } from '@main/middlewares/no-cache'
import app from '@main/config/app'
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
