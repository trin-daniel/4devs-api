import { Surveys } from '@Application/Entities'

export interface LoadSurveysRepository {
  LoadAll (account_id: string): Promise<Surveys[]>
}
