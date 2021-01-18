import { Express, Router } from 'express'
import { readdirSync } from 'fs'

export default (app: Express) => {
  const router = Router()
  app.use('/api', router)
  readdirSync(`${__dirname}/../routes`).map(async files => {
    if (!files.includes('.test.') && !files.endsWith('.map.')) {
      (await import(`../routes/${files}`)).default(router)
    }
  })
}
