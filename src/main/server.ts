import { addAliases } from 'module-alias'

addAliases(
  {
    '@infra': `${__dirname}/../infra`,
    '@domain': `${__dirname}/../domain`,
    '@main': `${__dirname}/../main`,
    '@presentation': `${__dirname}/../presentation`,
    '@validation': `${__dirname}/../validation`,
    '@data': `${__dirname}/../data`
  }
)

import env from '@main/config/env'
import { MongoHelper } from '@infra/database/mongo/helper/mongo-helper'
import { log } from 'debug'

log('app:server');
(async () => {
  try {
    await MongoHelper.connect(env.HOST)
    const app = (await import('@main/config/app')).default
    app.listen(env.PORT, log(`Server is running at http://localhost:${env.PORT}`))
  } catch (error) {
    log(error.message)
  }
})()
