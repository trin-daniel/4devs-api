import { Controller } from '@presentation/contracts'
import { SignupController } from '@presentation/controllers/account/sign-up/sign-up-controller'
import { SignupValidationFactory } from '@main/factories/controllers/account/sign-up/sign-up-validation-factory'
import { AuthenticationServiceFactory } from '@main/factories/use-cases/account/authentication/authentication-service-factory'
import { AddAccountServiceFactory } from '@main/factories/use-cases/account/add-account/add-account-service-factory'
import { LogControllerDecoratorFactory } from '@main/factories/decorators/log/log-controller-decorator-factory'

export const SignupControllerFactory = (): Controller => {
  return LogControllerDecoratorFactory(
    new SignupController(
      SignupValidationFactory(),
      AddAccountServiceFactory(),
      AuthenticationServiceFactory()
    )
  )
}
