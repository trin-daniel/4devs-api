import { Controller, Request, Response, EmailValidator } from '../../contracts'
import { MissingParamError, InvalidParamError } from '../../errors'
import { badRequest, serverError } from '../../helpers/http-helper'

export class SignupController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator
  ) {}

  handle (request: Request): Response {
    try {
      const requiredFields = ['name', 'email', 'password', 'confirmation']
      for (const field of requiredFields) {
        if (!request.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      if (request.body.password !== request.body.confirmation) {
        return badRequest(new InvalidParamError('confirmation'))
      }
      const isEmail = this.emailValidator.isEmail(request.body.email)
      if (!isEmail) {
        return badRequest(new InvalidParamError('email'))
      }
    } catch (error) {
      return serverError()
    }
  }
}
