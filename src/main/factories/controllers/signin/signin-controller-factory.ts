import { signinValidationFactory } from './signin-validation-factory'
import { Controller } from '../../../../presentation/contracts'
import { SigninController } from '../../../../presentation/controllers/signin/signin-controller'
import { AuthenticationService } from '../../../../data/services/account/authentication/authentication-service'
import { BcryptAdapter } from '../../../../infra/adapters/cryptography/bcrypt/bcrypt-adapter'
import { JsonWebTokenAdapter } from '../../../../infra/adapters/cryptography/json-web-token/json-web-token-adapter'
import { AccountRepository } from '../../../../infra/database/mongo/repositories/account/account-repository'
import { LogMongoRepository } from '../../../../infra/database/mongo/repositories/log-error/log-mongo-repository'
import { LogControllerDecorator } from '../../../decorators/controllers/log-controller-decorator'
import env from '../../../config/env'

export const signinControllerFactory = (): Controller => {
  const signinValidation = signinValidationFactory()
  const accountRepository = new AccountRepository()
  const bcryptAdapter = new BcryptAdapter(12)
  const jsonWebTokenAdapter = new JsonWebTokenAdapter(env.SECRET_KEY)
  const authentication = new AuthenticationService(accountRepository, bcryptAdapter, jsonWebTokenAdapter, accountRepository)
  const logErrorRepository = new LogMongoRepository()
  const signinController = new SigninController(signinValidation, authentication)
  return new LogControllerDecorator(signinController, logErrorRepository)
}
