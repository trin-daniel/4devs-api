import { Authentication } from '@domain/use-cases/authentication/authentication'
import
{
  Controller,
  Request,
  Response,
  Validator
} from '@presentation/contracts'
import
{
  badRequest,
  ok,
  serverError,
  unauthorized
} from '@presentation/helpers/http-helper'

export class SigninController implements Controller {
  constructor (
    private readonly validator: Validator,
    private readonly authentication: Authentication
  ) { }

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
