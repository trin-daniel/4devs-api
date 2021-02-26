import { SurveyResult } from '@Application/Entities'
import { SurveyResultDTO } from '@Application/DTOS'
import { LoadSurveyResultRepository, SaveSurveyResultRepository } from '@Data/Protocols/Database/Survey'
import { SaveSurveyResultUseCase } from '@Application/Use-Cases/Survey-Result/Save-Survey-Result'

export class SaveSurveyResultService implements SaveSurveyResultUseCase {
  constructor (
    private readonly SaveSurveyResultRepository: SaveSurveyResultRepository,
    private readonly LoadSurveyResultRepository: LoadSurveyResultRepository
  ) {}

  public async Save (data: SurveyResultDTO): Promise<SurveyResult> {
    const { survey_id, account_id } = data
    await this.SaveSurveyResultRepository.Save(data)
    const SurveyResult = await this.LoadSurveyResultRepository.LoadBySurveyId(survey_id, account_id)
    return SurveyResult
  }
}
