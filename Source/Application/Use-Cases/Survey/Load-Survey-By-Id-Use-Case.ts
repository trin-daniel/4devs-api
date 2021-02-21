import { Surveys } from '@Application/Entities'

export interface LoadSurveyByIdUseCase {
  Load (id: string): Promise<Surveys>
}
