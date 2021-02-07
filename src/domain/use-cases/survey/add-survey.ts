import { SurveyDTO } from '../../dtos'

export interface AddSurvey {
  add (data: SurveyDTO): Promise<void>
}
