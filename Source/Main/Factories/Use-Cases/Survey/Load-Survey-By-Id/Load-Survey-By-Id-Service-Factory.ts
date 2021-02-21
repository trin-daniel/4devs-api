import { LoadSurveyByIdUseCase } from '@Application/Use-Cases/Survey/Load-Survey-By-Id-Use-Case'
import { LoadSurveyByIdService } from '@Data/Services/Survey/Load-Survey-By-Id/Load-Survey-By-Id-service'
import { SurveyMongoRepository } from '@Infra/Database/Mongo/Repositories/Survey/Survey-Mongo-Repository'

export const LoadSurveyByIdServiceFactory = (): LoadSurveyByIdUseCase => {
  return new LoadSurveyByIdService(
    new SurveyMongoRepository()
  )
}
