import { SurveyDTO } from '../../../../domain/data-transfer-objects'

export interface AddSurveyRepository {
  add (data: SurveyDTO): Promise<void>
}
