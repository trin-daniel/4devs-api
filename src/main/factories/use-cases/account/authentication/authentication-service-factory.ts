import { Authentication } from '../../../../../domain/use-cases/authentication/authentication'
import { AuthenticationService } from '../../../../../data/services/account/authentication/authentication-service'
import { AccountMongoRepository } from '../../../../../infra/database/mongo/repositories/account/account-mongo-repository'
import { BcryptAdapter } from '../../../../../infra/adapters/cryptography/bcrypt/bcrypt-adapter'
import { JsonWebTokenAdapter } from '../../../../../infra/adapters/cryptography/json-web-token/json-web-token-adapter'
import env from '../../../../config/env'

export const AuthenticationServiceFactory = (): Authentication => {
  const accountMongoRepository = new AccountMongoRepository()
  const bcryptAdapter = new BcryptAdapter(12)
  const jsonWebTokenAdapter = new JsonWebTokenAdapter(env.SECRET_KEY)
  return new AuthenticationService(
    accountMongoRepository,
    bcryptAdapter,
    jsonWebTokenAdapter,
    accountMongoRepository
  )
}
