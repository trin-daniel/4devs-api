import { Express, Router } from 'express'
import { readdirSync } from 'fs'

export default (app: Express) => {
  const router = Router()
  app.use('/api', router)
  readdirSync(`${__dirname}/../Routes`).map(async files => {
    if (!files.includes('.test.') && !files.endsWith('.map.')) {
      (await import(`../Routes/${files}`)).default(router)
    }
  })
}
