import { Surveys } from '@domain/entities'

export interface LoadSurveys {
  load (): Promise<Surveys[]>
}
