import { AddSurvey } from '../../../../domain/use-cases/survey/add-survey'
import { Controller, Request, Response, Validator } from '../../../contracts'
import { badRequest, noContent, serverError } from '../../../helpers/http-helper'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validator: Validator,
    private readonly addSurvey: AddSurvey
  ) {}

  async handle (request: Request<any>): Promise<Response<any>> {
    try {
      const { question, answers } = request.body
      const error = this.validator.validate({ question, answers })
      if (error) {
        return badRequest(error)
      }
      await this.addSurvey.add({ question, answers })
      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
