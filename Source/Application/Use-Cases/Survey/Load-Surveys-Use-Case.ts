import { Surveys } from '@Application/Entities'

export interface LoadSurveysUseCase {
  Load (account_id: string): Promise<Surveys[]>
}
