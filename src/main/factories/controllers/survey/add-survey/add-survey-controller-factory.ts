import { AddSurveyController } from '../../../../../presentation/controllers/survey/add-survey/add-survey-controller'
import { Controller } from '../../../../../presentation/contracts'
import { LogControllerDecoratorFactory } from '../../../decorators/log/log-controller-decorator-factory'
import { AddSurveyServiceFactory } from '../../../use-cases/survey/add-survey/add-survey-service-factory'
import { AddSurveyValidationFactory } from './add-survey-validation-factory'

export const AddSurveyControllerFactory = (): Controller => {
  const addSurveyService = AddSurveyServiceFactory()
  const addSurveyValidationFactory = AddSurveyValidationFactory()
  const addSurveyController = new AddSurveyController(addSurveyValidationFactory, addSurveyService)
  return LogControllerDecoratorFactory(addSurveyController)
}
