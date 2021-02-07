import { SurveyDTO } from '../../data-transfer-objects'

export interface AddSurvey {
  add (data: SurveyDTO): Promise<void>
}
