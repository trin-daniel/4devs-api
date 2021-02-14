import { LoadSurveyById } from '@domain/use-cases/survey/load-survey-by-id'
import { Controller, Request, Response } from '@presentation/contracts'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById
  ) {}

  async handle (request: Request): Promise<Response> {
    const { survey_id } = request.params
    await this.loadSurveyById.load(survey_id)
    return Promise.resolve(null)
  }
}
