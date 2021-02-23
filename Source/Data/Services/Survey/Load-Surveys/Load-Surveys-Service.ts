import { Surveys } from '@Application/Entities'
import { LoadSurveysUseCase } from '@Application/Use-Cases/Survey/Load-Surveys-Use-Case'
import { LoadSurveysRepository } from '@Data/Protocols/Database'

export class LoadSurveysService implements LoadSurveysUseCase {
  constructor (
    private readonly LoadSurveysRepository: LoadSurveysRepository
  ) {}

  async Load (): Promise<Surveys[]> {
    const Surveys = await this.LoadSurveysRepository.LoadAll()
    return Surveys
  }
}