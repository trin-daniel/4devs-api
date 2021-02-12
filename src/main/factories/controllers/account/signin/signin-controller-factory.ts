import { SigninValidationFactory } from './signin-validation-factory'
import { Controller } from '../../../../../presentation/contracts'
import { SigninController } from '../../../../../presentation/controllers/account/signin/signin-controller'
import { AuthenticationServiceFactory } from '../../../use-cases/account/authentication/authentication-service-factory'
import { LogControllerDecoratorFactory } from '../../../decorators/log/log-controller-decorator-factory'

export const signinControllerFactory = (): Controller => {
  return LogControllerDecoratorFactory(
    new SigninController(
      SigninValidationFactory(),
      AuthenticationServiceFactory()
    )
  )
}
