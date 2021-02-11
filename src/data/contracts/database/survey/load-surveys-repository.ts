import { Surveys } from '../../../../domain/entities'

export interface LoadSurveysRepository {
  loadAll (): Promise<Surveys[]>
}
