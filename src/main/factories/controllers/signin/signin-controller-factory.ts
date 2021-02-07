import { SigninValidationFactory } from './signin-validation-factory'
import { Controller } from '../../../../presentation/contracts'
import { SigninController } from '../../../../presentation/controllers/signin/signin-controller'
import { AuthenticationServiceFactory } from '../../use-cases/account/authentication/authentication-service-factory'
import { LogControllerDecoratorFactory } from '../../decorators/log/log-controller-decorator-factory'

export const signinControllerFactory = (): Controller => {
  const signinValidationFactory = SigninValidationFactory()
  const authenticationServiceFactory = AuthenticationServiceFactory()
  const signinController = new SigninController(
    signinValidationFactory,
    authenticationServiceFactory
  )
  return LogControllerDecoratorFactory(signinController)
}
