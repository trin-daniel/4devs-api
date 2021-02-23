import { SurveyResult } from '@Application/Entities'
import { LoadSurveyResultUseCase } from '@Application/Use-Cases/Survey-Result/Load-Survey-Result-Use-Case'
import { LoadSurveyByIdRepository, LoadSurveyResultRepository } from '@Data/Protocols/Database'

export class LoadSurveyResultService implements LoadSurveyResultUseCase {
  constructor (
    private readonly LoadSurveyResult: LoadSurveyResultRepository,
    private readonly LoadSurveyByIdRepository: LoadSurveyByIdRepository
  ) {}

  async Load (survey_id: string):Promise<SurveyResult> {
    const Survey = await this.LoadSurveyResult.LoadBySurveyId(survey_id)
    if (!Survey) {
      await this.LoadSurveyByIdRepository.LoadById(survey_id)
    }
    return Survey
  }
}
