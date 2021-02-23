import { SurveyResult } from '@Application/Entities'

export interface LoadSurveyResultUseCase {
  Load(survey_id: string): Promise<SurveyResult>
}
