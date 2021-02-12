import { Authentication } from '../../../../../domain/use-cases/authentication/authentication'
import { AuthenticationService } from '../../../../../data/services/account/authentication/authentication-service'
import { AccountMongoRepository } from '../../../../../infra/database/mongo/repositories/account/account-mongo-repository'
import { BcryptAdapter } from '../../../../../infra/adapters/cryptography/bcrypt/bcrypt-adapter'
import { JsonWebTokenAdapter } from '../../../../../infra/adapters/cryptography/json-web-token/json-web-token-adapter'
import env from '../../../../config/env'

export const AuthenticationServiceFactory = (): Authentication => {
  return new AuthenticationService(
    new AccountMongoRepository(),
    new BcryptAdapter(12),
    new JsonWebTokenAdapter(env.SECRET_KEY),
    new AccountMongoRepository()
  )
}
