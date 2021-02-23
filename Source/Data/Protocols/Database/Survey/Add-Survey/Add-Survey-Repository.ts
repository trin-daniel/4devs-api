import { SurveyDTO } from '@Application/DTOS'

export interface AddSurveyRepository {
  Add (data: SurveyDTO): Promise<void>
}
