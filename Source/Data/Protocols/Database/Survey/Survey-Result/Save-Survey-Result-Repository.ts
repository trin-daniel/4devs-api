import { SurveyResultDTO } from '@Application/DTOS'

export interface SaveSurveyResultRepository {
  Save (data: SurveyResultDTO): Promise<void>
}
