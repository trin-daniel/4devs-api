import { Surveys } from '@domain/entities'
import { LoadSurveyByIdRepository } from '@data/contracts'
import { LoadSurveyById } from '@domain/use-cases/survey/load-survey-by-id'

export class LoadSurveyByIdService implements LoadSurveyById {
  constructor (
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
  ) {}

  public async load (id: string): Promise<Surveys> {
    await this.loadSurveyByIdRepository.loadById(id)
    return null
  }
}
