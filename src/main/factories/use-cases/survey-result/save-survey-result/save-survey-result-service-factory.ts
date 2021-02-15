import { SaveSurveyResultService } from '@data/services/survey-result/save-survey-result/save-survey-result-service'
import { SaveSurveyResult } from '@domain/use-cases/survey-result/save-survey-result'
import { SurveyResultRepository } from '@infra/database/mongo/repositories/survey-result/survey-result-mongo-repository'

export const SaveSurveyResultServiceFactory = (): SaveSurveyResult => {
  return new SaveSurveyResultService(
    new SurveyResultRepository()
  )
}
