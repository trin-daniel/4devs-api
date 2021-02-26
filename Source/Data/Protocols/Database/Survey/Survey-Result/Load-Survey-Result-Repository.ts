import { SurveyResult } from '@Application/Entities'

export interface LoadSurveyResultRepository {
  LoadBySurveyId (survey_id: string, account_id: string): Promise<SurveyResult>
}
