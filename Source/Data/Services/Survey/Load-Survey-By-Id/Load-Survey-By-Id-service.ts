import { Surveys } from '@Application/Entities'
import { LoadSurveyByIdUseCase } from '@Application/Use-Cases/Survey/Load-Survey-By-Id-Use-Case'
import { LoadSurveyByIdRepository } from '@Data/Protocols/Database/Survey'

export class LoadSurveyByIdService implements LoadSurveyByIdUseCase {
  constructor (
    private readonly LoadSurveyByIdRepository: LoadSurveyByIdRepository
  ) {}

  public async Load (id: string): Promise<Surveys> {
    const Survey = await this.LoadSurveyByIdRepository.LoadById(id)
    return Survey
  }
}
