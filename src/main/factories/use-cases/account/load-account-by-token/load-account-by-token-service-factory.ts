import { LoadAccountByTokenService } from '../../../../../data/services/account/load-account-by-token/load-account-by-token-service'
import { LoadAccountByToken } from '../../../../../domain/use-cases/account/load-account-by-token'
import { JsonWebTokenAdapter } from '../../../../../infra/adapters/cryptography/json-web-token/json-web-token-adapter'
import { AccountMongoRepository } from '../../../../../infra/database/mongo/repositories/account/account-mongo-repository'
import env from '../../../../config/env'

export const LoadAccountByTokenServiceFactory = (): LoadAccountByToken => {
  return new LoadAccountByTokenService(
    new JsonWebTokenAdapter(env.SECRET_KEY),
    new AccountMongoRepository()
  )
}
