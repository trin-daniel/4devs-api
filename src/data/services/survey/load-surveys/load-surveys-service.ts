import { Surveys } from '@domain/entities'
import { LoadSurveys } from '@domain/use-cases/survey/load-surveys'
import { LoadSurveysRepository } from '@data/contracts'

export class LoadSurveysService implements LoadSurveys {
  constructor (
    private readonly loadSurveysRepository: LoadSurveysRepository
  ) {}

  async load (): Promise<Surveys[]> {
    const surveys = await this.loadSurveysRepository.loadAll()
    return surveys
  }
}
