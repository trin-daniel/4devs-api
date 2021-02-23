import { SurveyResult } from '@Application/Entities'
import { LoadSurveyResultUseCase } from '@Application/Use-Cases/Survey-Result/Load-Survey-Result-Use-Case'
import { LoadSurveyResultRepository } from '@Data/Protocols/Database'

export class LoadSurveyResultService implements LoadSurveyResultUseCase {
  constructor (
    private readonly LoadSurveyResult: LoadSurveyResultRepository
  ) {}

  async Load (survey_id: string):Promise<SurveyResult> {
    const Survey = await this.LoadSurveyResult.LoadBySurveyId(survey_id)
    return Survey
  }
}
