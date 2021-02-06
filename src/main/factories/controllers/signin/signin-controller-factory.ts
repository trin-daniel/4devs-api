import { signinValidationFactory } from './signin-validation-factory'
import { authenticationServiceFactory } from '../../use-cases/account/authentication/authentication-service-factory'
import { Controller } from '../../../../presentation/contracts'
import { SigninController } from '../../../../presentation/controllers/signin/signin-controller'
import { logControllerDecoratorFactory } from '../../decorators/log/log-controller-decorator-factory'

export const signinControllerFactory = (): Controller => {
  const signinValidation = signinValidationFactory()
  const authenticationService = authenticationServiceFactory()
  const signinController = new SigninController(signinValidation, authenticationService)
  return logControllerDecoratorFactory(signinController)
}
