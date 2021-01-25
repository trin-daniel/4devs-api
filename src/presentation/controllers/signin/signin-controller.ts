import { Authentication } from '../../../domain/use-cases/authentication'
import { Controller, Request, Response } from '../../contracts'
import { EmailValidator } from '../../contracts/email-validator'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, serverError } from '../../helpers/http-helper'

export class SigninController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication
  ) {}

  async handle (request: Request<any>): Promise<Response<any>> {
    try {
      const { email, password } = request.body
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
      await this.authentication.auth(
        { email, password }
      )
    } catch (error) {
      return serverError(error)
    }
  }
}
