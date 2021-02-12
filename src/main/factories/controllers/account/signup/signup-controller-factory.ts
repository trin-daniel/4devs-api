import { Controller } from '../../../../../presentation/contracts'
import { SignupController } from '../../../../../presentation/controllers/account/signup/signup-controller'
import { SignupValidationFactory } from './signup-validation-factory'
import { AuthenticationServiceFactory } from '../../../use-cases/account/authentication/authentication-service-factory'
import { AddAccountServiceFactory } from '../../../use-cases/account/add-account/add-account-service-factory'
import { LogControllerDecoratorFactory } from '../../../decorators/log/log-controller-decorator-factory'

export const SignupControllerFactory = (): Controller => {
  return LogControllerDecoratorFactory(
    new SignupController(
      SignupValidationFactory(),
      AddAccountServiceFactory(),
      AuthenticationServiceFactory()
    )
  )
}
