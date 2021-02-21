import { AddSurveyUseCase } from '@Application/Use-Cases/Survey/Add-Survey-Use-Case'
import { AddSurveyServices } from '@Data/Services/Survey/Add-Survey/Add-Survey-Services'
import { SurveyMongoRepository } from '@Infra/Database/Mongo/Repositories/Survey/Survey-Mongo-Repository'

export const AddSurveyServiceFactory = (): AddSurveyUseCase => {
  return new AddSurveyServices(
    new SurveyMongoRepository()
  )
}
