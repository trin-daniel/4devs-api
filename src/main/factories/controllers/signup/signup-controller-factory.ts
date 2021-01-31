import { Controller } from '../../../../presentation/contracts'
import { SignupController } from '../../../../presentation/controllers/signup/signup-controller'
import { AddAccountService } from '../../../../data/services/account/add-account/add-account-service'
import { BcryptAdapter } from '../../../../infra/adapters/bcrypt/bcrypt-adapter'
import { AccountRepository } from '../../../../infra/database/mongo/repositories/account/account-repository'
import { LogControllerDecorator } from '../../../decorators/controllers/log-controller-decorator'
import { LogMongoRepository } from '../../../../infra/database/mongo/repositories/log-error/log-mongo-repository'
import { signupValidationFactory } from './signup-validation-factory'

export const signupControllerFactory = (): Controller => {
  const accountRepository = new AccountRepository()
  const hasher = new BcryptAdapter(12)
  const addAccount = new AddAccountService(hasher, accountRepository)
  const signupValidation = signupValidationFactory()
  const signupController = new SignupController(signupValidation, addAccount)
  const LogErrorRepository = new LogMongoRepository()
  return new LogControllerDecorator(signupController, LogErrorRepository)
}
