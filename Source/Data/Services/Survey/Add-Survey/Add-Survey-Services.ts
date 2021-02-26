import { SurveyDTO } from '@Application/DTOS'
import { AddSurveyUseCase } from '@Application/Use-Cases/Survey/Add-Survey-Use-Case'
import { AddSurveyRepository } from '@Data/Protocols/Database/Survey'

export class AddSurveyServices implements AddSurveyUseCase {
  constructor (
    private readonly AddSurveyRepository: AddSurveyRepository
  ) {}

  async Add (data: SurveyDTO): Promise<void> {
    await this.AddSurveyRepository.Add(data)
  }
}
