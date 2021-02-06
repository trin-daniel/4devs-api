import { Controller } from '../../../../presentation/contracts'
import { SignupController } from '../../../../presentation/controllers/signup/signup-controller'
import { signupValidationFactory } from './signup-validation-factory'
import { authenticationServiceFactory } from '../../use-cases/account/authentication/authentication-service-factory'
import { addAccountService } from '../../use-cases/account/add-account/add-account-service-factory'
import { logControllerDecoratorFactory } from '../../decorators/log/log-controller-decorator-factory'

export const signupControllerFactory = (): Controller => {
  const addAccount = addAccountService()
  const signupValidation = signupValidationFactory()
  const authenticationService = authenticationServiceFactory()
  const signupController = new SignupController(signupValidation, addAccount, authenticationService)
  return logControllerDecoratorFactory(signupController)
}
