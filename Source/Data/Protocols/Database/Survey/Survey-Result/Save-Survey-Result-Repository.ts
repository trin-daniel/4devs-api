import { SurveyResult } from '@Application/Entities'
import { SurveyResultDTO } from '@Application/DTOS'

export interface SaveSurveyResultRepository {
  Save (data: SurveyResultDTO): Promise<SurveyResult>
}
