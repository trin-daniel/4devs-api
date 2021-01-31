import { Authentication } from '../../../domain/use-cases/authentication'
import { Controller, Request, Response } from '../../contracts'
import { EmailValidator } from '../../contracts/email-validator'
import { Validator } from '../../contracts/validator'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http-helper'

export class SigninController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication,
    private readonly validator: Validator
  ) {}

  async handle (request: Request<any>): Promise<Response<any>> {
    try {
      const { email, password } = request.body
      this.validator.validate({ email, password })
      const requiredFields = ['email', 'password']
      for (const field of requiredFields) {
        if (!request.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const isEmail = this.emailValidator.isEmail(email)
      if (!isEmail) {
        return badRequest(new InvalidParamError('email'))
      }
      const token = await this.authentication.auth({ email, password })
      return !token ? unauthorized() : ok({ token })
    } catch (error) {
      return serverError(error)
    }
  }
}
