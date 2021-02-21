import { Controller } from '@Presentation/Protocols'
import { LoadSurveysController } from '@Presentation/Controllers/Survey/Load-Surveys/Load-Surveys-Controller'
import { LogControllerDecoratorFactory } from '@Main/Factories/Decorators/Log/Log-Controller-Decorator-Factory'
import { LoadSurveysServiceFactory } from '@Main/Factories/Use-Cases/Survey/Load-Surveys/Load-Surveys-Service-Factory'

export const LoadSurveysControllerFactory = (): Controller => {
  return LogControllerDecoratorFactory(
    new LoadSurveysController(LoadSurveysServiceFactory())
  )
}
