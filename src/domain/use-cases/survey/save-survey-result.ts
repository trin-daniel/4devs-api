import { SurveyResult } from '@domain/entities'
import { SurveyResultDTO } from '@domain/dtos'

export interface SaveSurveyResult {
  save (data: SurveyResultDTO): Promise<SurveyResult>
}
