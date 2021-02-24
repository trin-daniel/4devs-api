import { LoadSurveyResultUseCase } from '@Application/Use-Cases/Survey-Result/Load-Survey-Result-Use-Case'
import { SurveyMongoRepository } from '@Infra/Database/Mongo/Repositories/Survey/Survey-Mongo-Repository'
import { SurveyResultRepository } from '@Infra/Database/Mongo/Repositories/Survey-Result/Survey-Result-Mongo-Repository'
import { LoadSurveyResultService } from '@Data/Services/Survey-Result/Load-Survey-Result/Load-Survey-Result-Service'

export const LoadSurveyResultServiceFactory = (): LoadSurveyResultUseCase => {
  return new LoadSurveyResultService(
    new SurveyResultRepository(),
    new SurveyMongoRepository()
  )
}
