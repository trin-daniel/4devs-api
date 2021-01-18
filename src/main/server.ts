import { log } from 'debug'
import { MongoHelper } from '../infra/database/mongo/helper/mongo-helper'
import env from './config/env'
log('app:server');
(async () => {
  try {
    await MongoHelper.connect(env.HOST)
    const app = (await import('./config/app')).default
    app.listen(env.PORT, log(`Server is running at http://localhost:${env.PORT}`))
  } catch (error) {
    log(error.message)
  }
})()
