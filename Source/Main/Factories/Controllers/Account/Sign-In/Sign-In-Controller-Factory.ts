import { Controller } from '@Presentation/Protocols'
import { SignInController } from '@Presentation/Controllers/Account/Sign-In/Sign-In-Controller'
import { SignInValidationFactory } from '@Main/Factories/Controllers/Account/Sign-In/Sign-In-Validation-Factory'
import { AuthenticationServiceFactory } from '@Main/Factories/Use-Cases/Account/Authentication/Authentication-Service-Factory'
import { LogControllerDecoratorFactory } from '@Main/Factories/Decorators/Log/Log-Controller-Decorator-Factory'

export const signinControllerFactory = (): Controller => {
  return LogControllerDecoratorFactory(
    new SignInController(
      SignInValidationFactory(),
      AuthenticationServiceFactory()
    )
  )
}
