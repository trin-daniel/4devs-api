import { SurveyResult } from '@Application/Entities'
import { SurveyResultDTO } from '@Application/DTOS'

export interface SaveSurveyResultUseCase {
  Save (data: SurveyResultDTO): Promise<SurveyResult>
}
