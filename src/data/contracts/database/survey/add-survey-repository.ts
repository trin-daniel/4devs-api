import { SurveyDTO } from '@domain/dtos'

export interface AddSurveyRepository {
  add (data: SurveyDTO): Promise<void>
}
