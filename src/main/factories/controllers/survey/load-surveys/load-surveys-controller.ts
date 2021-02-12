import { Controller } from '../../../../../presentation/contracts'
import { LoadSurveysController } from '../../../../../presentation/controllers/survey/load-surveys/load-surveys-controller'
import { LogControllerDecoratorFactory } from '../../../decorators/log/log-controller-decorator-factory'
import { LoadSurveysServiceFactory } from '../../../use-cases/survey/load-surveys/load-surveys-service-factory'

export const LoadSurveysControllerFactory = (): Controller => {
  return LogControllerDecoratorFactory(
    new LoadSurveysController(LoadSurveysServiceFactory()
    ))
}
