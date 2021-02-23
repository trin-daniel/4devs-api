import { Surveys } from '@Application/Entities'

export interface LoadSurveysRepository {
  LoadAll (): Promise<Surveys[]>
}
