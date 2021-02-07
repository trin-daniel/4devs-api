import { Controller } from '../../../../presentation/contracts'
import { SignupController } from '../../../../presentation/controllers/signup/signup-controller'
import { SignupValidationFactory } from './signup-validation-factory'
import { AuthenticationServiceFactory } from '../../use-cases/account/authentication/authentication-service-factory'
import { AddAccountServiceFactory } from '../../use-cases/account/add-account/add-account-service-factory'
import { LogControllerDecoratorFactory } from '../../decorators/log/log-controller-decorator-factory'

export const SignupControllerFactory = (): Controller => {
  const addAccountServiceFactory = AddAccountServiceFactory()
  const signupValidationFactory = SignupValidationFactory()
  const authenticationServiceFactory = AuthenticationServiceFactory()
  const signupController = new SignupController(
    signupValidationFactory,
    addAccountServiceFactory,
    authenticationServiceFactory
  )
  return LogControllerDecoratorFactory(signupController)
}
