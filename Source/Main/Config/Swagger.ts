import swagger from '@Main/Docs'
import { noCache } from '@Main/Middlewares'
import { serve, setup } from 'swagger-ui-express'
import { Express } from 'express'

export default (app: Express): void => {
  app.use('/api/docs', noCache, serve, setup(swagger))
}
