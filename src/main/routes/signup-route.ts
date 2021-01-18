import { Router } from 'express'

export default (router: Router): void => {
  router.post('/signup', async (request, response, next) => {
    response.json({ message: 'ok' })
    next()
  })
}
