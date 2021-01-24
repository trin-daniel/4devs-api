import { Controller } from '../../../../presentation/contracts'
import { SignupController } from '../../../../presentation/controllers/signup/signup-controller'
import { EmailValidatorAdapter } from '../../../../utils/email-validator-adapter'
import { AddAccountService } from '../../../../data/services/account/add-account/add-account-service'
import { BcryptAdapter } from '../../../../infra/adapters/bcrypt/bcrypt-adapter'
import { AccountRepository } from '../../../../infra/database/mongo/repositories/account/account-repository'
import { LogControllerDecorator } from '../../../decorators/controllers/log-controller-decorator'
import { LogMongoRepository } from '../../../../infra/database/mongo/repositories/log-error/log-mongo-repository'

export const signupControllerFactory = (): Controller => {
  const accountRepository = new AccountRepository()
  const emailValidator = new EmailValidatorAdapter()
  const hasher = new BcryptAdapter(12)
  const addAccount = new AddAccountService(hasher, accountRepository)
  const signupController = new SignupController(emailValidator, addAccount)
  const LogErrorRepository = new LogMongoRepository()
  return new LogControllerDecorator(signupController, LogErrorRepository)
}
