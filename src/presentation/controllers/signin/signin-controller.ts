import { Controller, Request, Response } from '../../contracts'
import { EmailValidator } from '../../contracts/email-validator'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'

export class SigninController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator
  ) {}

  async handle (request: Request<any>): Promise<Response<any>> {
    const required = ['email', 'password']
    for (const field of required) {
      if (!request.body[field]) {
        return Promise.resolve(badRequest(new MissingParamError(field)))
      }
    }
    const isEmail = this.emailValidator.isEmail(request.body.email)
    if (!isEmail) {
      return Promise.resolve(badRequest(new InvalidParamError('email')))
    }
  }
}
