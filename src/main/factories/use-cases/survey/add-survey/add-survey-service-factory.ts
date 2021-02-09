import { AddSurvey } from '../../../../../domain/use-cases/survey/add-survey'
import { AddSurveyServices } from '../../../../../data/services/survey/add-survey-services'
import { SurveyMongoRepository } from '../../../../../infra/database/mongo/repositories/survey/survey-mongo-repository'

export const AddSurveyServiceFactory = (): AddSurvey => {
  const addSurveyRepository = new SurveyMongoRepository()
  return new AddSurveyServices(addSurveyRepository)
}
