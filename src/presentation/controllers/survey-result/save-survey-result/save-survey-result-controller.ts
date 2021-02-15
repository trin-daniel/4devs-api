import { SurveyResultDTO } from '@domain/dtos'
import { LoadSurveyById } from '@domain/use-cases/survey/load-survey-by-id'
import { Controller, Request, Response } from '@presentation/contracts'
import { InvalidParamError } from '@presentation/errors'
import { forbidden, serverError } from '@presentation/helpers/http-helper'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById
  ) {}

  async handle (request: Request<SurveyResultDTO>): Promise<Response<SurveyResultDTO>> {
    try {
      const {
        params: { survey_id }, body: { answer }
      } = request as Request<SurveyResultDTO, {[key: string]: string}, {[key: string]: string}>
      const survey = await this.loadSurveyById.load(survey_id)
      if (survey) {
        const answers = survey.answers.map(item => item.answer)
        return !answers.includes(answer) && forbidden(new InvalidParamError('answer'))
      } else {
        return forbidden(new InvalidParamError('survey_id'))
      }
    } catch (error) {
      return serverError(error)
    }
  }
}
