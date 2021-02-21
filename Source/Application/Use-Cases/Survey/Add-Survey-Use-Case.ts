import { SurveyDTO } from '@Application/DTOS'

export interface AddSurveyUseCase {
  Add (data: SurveyDTO): Promise<void>
}
