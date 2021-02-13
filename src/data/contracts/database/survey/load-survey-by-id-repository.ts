import { Surveys } from '@domain/entities'

export interface LoadSurveyByIdRepository {
  loadById (id: string): Promise<Surveys>
}
