import { SurveyResult } from '@domain/entities'
import { SurveyResultDTO } from '@domain/dtos'
import { SaveSurveyResult } from '@domain/use-cases/survey/save-survey-result'
import { SaveSurveyResultRepository } from '@data/contracts'

export class SaveSurveyResultService implements SaveSurveyResult {
  constructor (
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository
  ) {}

  public async save (data: SurveyResultDTO): Promise<SurveyResult> {
    await this.saveSurveyResultRepository.save(data)
    return null
  }
}
