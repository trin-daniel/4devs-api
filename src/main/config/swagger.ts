import { Express } from 'express'
import { serve, setup } from 'swagger-ui-express'
import swagger from '@main/docs'

export default (app: Express): void => {
  app.use('/api/docs', serve, setup(swagger))
}
