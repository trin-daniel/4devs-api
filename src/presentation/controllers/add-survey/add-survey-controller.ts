import { Controller, Request, Response, Validator } from '../../contracts'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validator: Validator
  ) {}

  async handle (request: Request<any>): Promise<Response<any>> {
    const { question, answers } = request.body
    this.validator.validate({ question, answers })
    return Promise.resolve(null)
  }
}
