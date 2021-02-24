import { Controller } from '@Presentation/Protocols'
import { LoadSurveyResultController } from '@Presentation/Controllers/Survey-Result/Load-Survey-Result/Load-Survey-Result-Controller'
import { LogControllerDecoratorFactory } from '@Main/Factories/Decorators/Log/Log-Controller-Decorator-Factory'
import { LoadSurveyResultServiceFactory } from '@Main/Factories/Use-Cases/Survey-Result/Load-Survey-Result/Load-Survey-Result-Service-Factory'
import { LoadSurveyByIdServiceFactory } from '@Main/Factories/Use-Cases/Survey/Load-Survey-By-Id/Load-Survey-By-Id-Service-Factory'

export const LoadSurveyResultControllerFactory = (): Controller => {
  return LogControllerDecoratorFactory(
    new LoadSurveyResultController(LoadSurveyByIdServiceFactory(), LoadSurveyResultServiceFactory())
  )
}
