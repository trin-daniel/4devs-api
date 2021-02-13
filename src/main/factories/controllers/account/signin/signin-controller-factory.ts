import { Controller } from '@presentation/contracts'
import { SigninController } from '@presentation/controllers/account/signin/signin-controller'
import { SigninValidationFactory } from '@main/factories/controllers/account/signin/signin-validation-factory'
import { AuthenticationServiceFactory } from '@main/factories/use-cases/account/authentication/authentication-service-factory'
import { LogControllerDecoratorFactory } from '@main/factories/decorators/log/log-controller-decorator-factory'

export const signinControllerFactory = (): Controller => {
  return LogControllerDecoratorFactory(
    new SigninController(
      SigninValidationFactory(),
      AuthenticationServiceFactory()
    )
  )
}
