import { Authentication } from '../../../domain/use-cases/authentication/authentication'
import { Validator } from '../../contracts/validator'
import { Controller, Request, Response } from '../../contracts'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http-helper'

export class SigninController implements Controller {
  constructor (
    private readonly validator: Validator,
    private readonly authentication: Authentication
  ) {}

  async handle (request: Request<any>): Promise<Response<any>> {
    try {
      const { email, password } = request.body
      const error = this.validator.validate({ email, password })
      if (error) {
        return badRequest(error)
      }
      const token = await this.authentication.auth({ email, password })
      return !token ? unauthorized() : ok({ token })
    } catch (error) {
      return serverError(error)
    }
  }
}
