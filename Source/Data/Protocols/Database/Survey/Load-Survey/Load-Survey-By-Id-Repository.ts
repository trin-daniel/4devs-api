import { Surveys } from '@Application/Entities'

export interface LoadSurveyByIdRepository {
  LoadById (id: string): Promise<Surveys>
}
