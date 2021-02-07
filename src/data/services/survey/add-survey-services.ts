import { SurveyDTO } from '../../../domain/data-transfer-objects'
import { AddSurvey } from '../../../domain/use-cases/survey/add-survey'
import { AddSurveyRepository } from '../../contracts'

export class AddSurveyServices implements AddSurvey {
  constructor (
    private readonly addSurveyRepository: AddSurveyRepository
  ) {}

  async add (data: SurveyDTO): Promise<void> {
    await this.addSurveyRepository.add(data)
  }
}
