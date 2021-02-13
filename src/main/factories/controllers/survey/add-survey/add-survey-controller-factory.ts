import { AddSurveyController } from '@presentation/controllers/survey/add-survey/add-survey-controller'
import { Controller } from '@presentation/contracts'
import { AddSurveyValidationFactory } from '@main/factories/controllers/survey/add-survey/add-survey-validation-factory'
import { LogControllerDecoratorFactory } from '@main/factories/decorators/log/log-controller-decorator-factory'
import { AddSurveyServiceFactory } from '@main/factories/use-cases/survey/add-survey/add-survey-service-factory'

export const AddSurveyControllerFactory = (): Controller => {
  return LogControllerDecoratorFactory(
    new AddSurveyController(
      AddSurveyValidationFactory(),
      AddSurveyServiceFactory()
    ))
}
