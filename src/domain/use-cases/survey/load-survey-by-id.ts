import { Surveys } from '@domain/entities'

export interface LoadSurveyById {
  load (id: string): Promise<Surveys>
}
