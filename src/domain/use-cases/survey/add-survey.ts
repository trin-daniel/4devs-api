import { SurveyDTO } from '@domain/dtos'

export interface AddSurvey {
  add (data: SurveyDTO): Promise<void>
}
