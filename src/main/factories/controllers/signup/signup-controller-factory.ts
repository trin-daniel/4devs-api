import { Controller } from '../../../../presentation/contracts'
import { SignupController } from '../../../../presentation/controllers/signup/signup-controller'
import { AddAccountService } from '../../../../data/services/account/add-account/add-account-service'
import { BcryptAdapter } from '../../../../infra/adapters/cryptography/bcrypt/bcrypt-adapter'
import { AccountRepository } from '../../../../infra/database/mongo/repositories/account/account-repository'
import { LogControllerDecorator } from '../../../decorators/controllers/log-controller-decorator'
import { LogMongoRepository } from '../../../../infra/database/mongo/repositories/log-error/log-mongo-repository'
import { signupValidationFactory } from './signup-validation-factory'
import { AuthenticationService } from '../../../../data/services/account/authentication/authentication-service'
import { JsonWebTokenAdapter } from '../../../../infra/adapters/cryptography/json-web-token/json-web-token-adapter'
import env from '../../../config/env'

export const signupControllerFactory = (): Controller => {
  const accountRepository = new AccountRepository()
  const hasher = new BcryptAdapter(12)
  const jsonWebTokenAdapter = new JsonWebTokenAdapter(env.SECRET_KEY)
  const authentication = new AuthenticationService(accountRepository, hasher, jsonWebTokenAdapter, accountRepository)
  const addAccount = new AddAccountService(hasher, accountRepository)
  const signupValidation = signupValidationFactory()
  const signupController = new SignupController(signupValidation, addAccount, authentication)
  const LogErrorRepository = new LogMongoRepository()
  return new LogControllerDecorator(signupController, LogErrorRepository)
}
