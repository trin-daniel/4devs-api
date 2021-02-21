import { AddSurveyController } from '@Presentation/Controllers/Survey/Add-Survey/Add-Survey-Controller'
import { Controller } from '@Presentation/Protocols'
import { AddSurveyValidationFactory } from '@Main/Factories/Controllers/Survey/Add-Survey/Add-Survey-Validation-Factory'
import { LogControllerDecoratorFactory } from '@Main/Factories/Decorators/Log/Log-Controller-Decorator-Factory'
import { AddSurveyServiceFactory } from '@Main/Factories/Use-Cases/Survey/Add-Survey/Add-Survey-Service-Factory'

export const AddSurveyControllerFactory = (): Controller => {
  return LogControllerDecoratorFactory(
    new AddSurveyController(
      AddSurveyValidationFactory(),
      AddSurveyServiceFactory()
    ))
}
