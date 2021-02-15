import { LoadSurveyById } from '@domain/use-cases/survey/load-survey-by-id'
import { LoadSurveyByIdService } from '@data/services/survey/load-survey-by-id/load-survey-by-id-service'
import { SurveyMongoRepository } from '@infra/database/mongo/repositories/survey/survey-mongo-repository'

export const LoadSurveyByIdServiceFactory = (): LoadSurveyById => {
  return new LoadSurveyByIdService(
    new SurveyMongoRepository()
  )
}
