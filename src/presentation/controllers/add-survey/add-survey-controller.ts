import { Controller, Request, Response, Validator } from '../../contracts'
import { badRequest } from '../../helpers/http-helper'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validator: Validator
  ) {}

  async handle (request: Request<any>): Promise<Response<any>> {
    const { question, answers } = request.body
    const error = this.validator.validate({ question, answers })
    if (error) {
      return badRequest(error)
    }
    return Promise.resolve(null)
  }
}
