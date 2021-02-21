import { Surveys } from '@Application/Entities'

export interface LoadSurveysUseCase {
  Load (): Promise<Surveys[]>
}
