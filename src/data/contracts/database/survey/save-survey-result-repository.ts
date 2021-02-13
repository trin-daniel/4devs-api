import { SurveyResult } from '@domain/entities'
import { SurveyResultDTO } from '@domain/dtos'

export interface SaveSurveyResultRepository {
  save (data: SurveyResultDTO): Promise<SurveyResult>
}
