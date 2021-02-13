import { LoadSurveys } from '@domain/use-cases/survey/load-surveys'
import { LoadSurveysService } from '@data/services/survey/load-surveys/load-surveys-service'
import { SurveyMongoRepository } from '@infra/database/mongo/repositories/survey/survey-mongo-repository'

export const LoadSurveysServiceFactory = (): LoadSurveys => {
  return new LoadSurveysService(
    new SurveyMongoRepository()
  )
}
