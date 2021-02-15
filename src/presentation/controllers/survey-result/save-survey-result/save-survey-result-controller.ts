import { LoadSurveyById } from '@domain/use-cases/survey/load-survey-by-id'
import { Controller, Request, Response } from '@presentation/contracts'
import { InvalidParamError } from '@presentation/errors'
import { forbidden, serverError } from '@presentation/helpers/http-helper'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById
  ) {}

  async handle (request: Request): Promise<Response> {
    try {
      const { survey_id } = request.params
      const survey = await this.loadSurveyById.load(survey_id)
      if (!survey) {
        return forbidden(new InvalidParamError('survey_id'))
      }
      return Promise.resolve(null)
    } catch (error) {
      return serverError(error)
    }
  }
}
