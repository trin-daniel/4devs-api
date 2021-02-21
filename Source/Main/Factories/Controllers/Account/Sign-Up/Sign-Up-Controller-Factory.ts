import { Controller } from '@Presentation/Protocols'
import { SignUpController } from '@Presentation/Controllers/Account/Sign-Up/Sign-Up-Controller'
import { SignUpValidationFactory } from '@Main/Factories/Controllers/Account/Sign-Up/Sign-Up-Validation-Factory'
import { AuthenticationServiceFactory } from '@Main/Factories/Use-Cases/Account/Authentication/Authentication-Service-Factory'
import { AddAccountServiceFactory } from '@Main/Factories/Use-Cases/Account/Add-Account/Add-Account-Service-Factory'
import { LogControllerDecoratorFactory } from '@Main/Factories/Decorators/Log/Log-Controller-Decorator-Factory'

export const SignUpControllerFactory = (): Controller => {
  return LogControllerDecoratorFactory(
    new SignUpController(
      SignUpValidationFactory(),
      AddAccountServiceFactory(),
      AuthenticationServiceFactory()
    )
  )
}
