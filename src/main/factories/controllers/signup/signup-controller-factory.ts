import { Controller } from '../../../../presentation/contracts'
import { SignupController } from '../../../../presentation/controllers/signup/signup-controller'
import { EmailValidatorAdapter } from '../../../../utils/email-validator-adapter'
import { AddAccountService } from '../../../../data/services/account/add-account/add-account-service'
import { BcryptAdapter } from '../../../../infra/adapters/bcrypt/bcrypt-adapter'
import { AccountRepository } from '../../../../infra/database/mongo/repositories/account/account-repository'

export const signupControllerFactory = (): Controller => {
  const accountRepository = new AccountRepository()
  const emailValidator = new EmailValidatorAdapter()
  const hasher = new BcryptAdapter(12)
  const addAccount = new AddAccountService(hasher, accountRepository)
  return new SignupController(emailValidator, addAccount)
}
