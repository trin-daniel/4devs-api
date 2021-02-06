import { Authentication } from '../../../../../domain/use-cases/authentication/authentication'
import { AuthenticationService } from '../../../../../data/services/account/authentication/authentication-service'
import { AccountRepository } from '../../../../../infra/database/mongo/repositories/account/account-repository'
import { BcryptAdapter } from '../../../../../infra/adapters/cryptography/bcrypt/bcrypt-adapter'
import { JsonWebTokenAdapter } from '../../../../../infra/adapters/cryptography/json-web-token/json-web-token-adapter'
import env from '../../../../config/env'

export const authenticationServiceFactory = (): Authentication => {
  const accountRepository = new AccountRepository()
  const bcryptAdapter = new BcryptAdapter(12)
  const jsonWebTokenAdapter = new JsonWebTokenAdapter(env.SECRET_KEY)
  return new AuthenticationService(accountRepository, bcryptAdapter, jsonWebTokenAdapter, accountRepository)
}
