import { LogControllerDecoratorFactory } from '@main/factories/decorators/log/log-controller-decorator-factory'
import { SaveSurveyResultServiceFactory } from '@main/factories/use-cases/survey-result/save-survey-result/save-survey-result-service-factory'
import { LoadSurveyByIdServiceFactory } from '@main/factories/use-cases/survey/load-survey-by-id/load-survey-by-id-service-factory'
import { Controller } from '@presentation/contracts'
import { SaveSurveyResultController } from '@presentation/controllers/survey-result/save-survey-result/save-survey-result-controller'

export const SaveSurveyResultControllerFactory = (): Controller => {
  return LogControllerDecoratorFactory(
    new SaveSurveyResultController(
      LoadSurveyByIdServiceFactory(),
      SaveSurveyResultServiceFactory()
    ))
}
