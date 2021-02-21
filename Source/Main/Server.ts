import { addAliases } from 'module-alias'

addAliases(
  {
    '@Infra': `${__dirname}/../Infra`,
    '@Application': `${__dirname}/../Application`,
    '@Main': `${__dirname}/../Main`,
    '@Presentation': `${__dirname}/../Presentation`,
    '@Validation': `${__dirname}/../Validation`,
    '@Data': `${__dirname}/../Data`
  }
)

import Env from '@Main/Config/Env'
import { MongoHelper } from '@Infra/Database/Mongo/Helper/Mongo-Helper'
import { log } from 'debug'

log('app:server');
(async () => {
  try {
    await MongoHelper.connect(Env.HOST)
    const App = (await import('@Main/Config/App')).default
    App.listen(Env.PORT, log(`Server is running at http://localhost:${Env.PORT}`))
  } catch (error) {
    log(error.message)
  }
})()
