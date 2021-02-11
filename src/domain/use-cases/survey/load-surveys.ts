import { Surveys } from '../../entities'

export interface LoadSurveys {
  load (): Promise<Surveys[]>
}
