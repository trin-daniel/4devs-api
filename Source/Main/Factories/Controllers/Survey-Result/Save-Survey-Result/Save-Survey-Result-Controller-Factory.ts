import { LogControllerDecoratorFactory } from '@Main/Factories/Decorators/Log/Log-Controller-Decorator-Factory'
import { SaveSurveyResultServiceFactory } from '@Main/Factories/Use-Cases/Survey-Result/Save-Survey-Result/Save-Survey-Result-Service-Factory'
import { LoadSurveyByIdServiceFactory } from '@Main/Factories/Use-Cases/Survey/Load-Survey-By-Id/Load-Survey-By-Id-Service-Factory'
import { Controller } from '@Presentation/Protocols'
import { SaveSurveyResultController } from '@Presentation/Controllers/Survey-Result/Save-Survey-Result/Save-Survey-Result-Controller'

export const SaveSurveyResultControllerFactory = (): Controller => {
  return LogControllerDecoratorFactory(
    new SaveSurveyResultController(
      LoadSurveyByIdServiceFactory(),
      SaveSurveyResultServiceFactory())
  )
}
