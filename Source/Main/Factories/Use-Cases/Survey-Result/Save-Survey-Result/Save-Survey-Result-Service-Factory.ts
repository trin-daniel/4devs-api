import {
  SaveSurveyResultService
} from '@Data/Services/Survey-Result/Save-Survey-Result/Save-Survey-Result-Service'
import {
  SaveSurveyResultUseCase
} from '@Application/Use-Cases/Survey-Result/Save-Survey-Result'
import {
  SurveyResultRepository
} from '@Infra/Database/Mongo/Repositories/Survey-Result/Survey-Result-Mongo-Repository'

export const SaveSurveyResultServiceFactory = (): SaveSurveyResultUseCase => {
  return new SaveSurveyResultService(
    new SurveyResultRepository(),
    new SurveyResultRepository()
  )
}
