import { LoadSurveysUseCase } from '@Application/Use-Cases/Survey/Load-Surveys-Use-Case'
import { LoadSurveysService } from '@Data/Services/Survey/Load-Surveys/Load-Surveys-Service'
import { SurveyMongoRepository } from '@Infra/Database/Mongo/Repositories/Survey/Survey-Mongo-Repository'

export const LoadSurveysServiceFactory = (): LoadSurveysUseCase => {
  return new LoadSurveysService(
    new SurveyMongoRepository()
  )
}
