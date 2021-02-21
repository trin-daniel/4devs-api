import { SurveyResult } from '@Application/Entities'
import { SurveyResultDTO } from '@Application/DTOS'
import { SaveSurveyResultRepository } from '@Data/Protocols/Database'
import { SaveSurveyResultUseCase } from '@Application/Use-Cases/Survey-Result/Save-Survey-Result'

export class SaveSurveyResultService implements SaveSurveyResultUseCase {
  constructor (
    private readonly SaveSurveyResultRepository: SaveSurveyResultRepository
  ) {}

  public async Save (data: SurveyResultDTO): Promise<SurveyResult> {
    const SurveyResult = await this.SaveSurveyResultRepository.Save(data)
    return SurveyResult
  }
}
