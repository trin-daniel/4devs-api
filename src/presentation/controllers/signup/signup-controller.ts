import { AddAccount } from '../../../domain/use-cases/account/add-account'
import { Controller, Request, Response, Validator } from '../../contracts'
import { badRequest, forbidden, ok, serverError } from '../../helpers/http-helper'
import { Authentication } from '../../../domain/use-cases/authentication/authentication'
import { EmailInUseError } from '../../errors'

export class SignupController implements Controller {
  constructor (
    private readonly validator: Validator,
    private readonly addAccount: AddAccount,
    private readonly authentication: Authentication
  ) {}

  async handle (request: Request): Promise<Response> {
    try {
      const { name, email, password, confirmation } = request.body
      const error = this.validator.validate({ name, email, password, confirmation })
      if (error) {
        return badRequest(error)
      }
      const account = await this.addAccount.add({ name, email, password })
      if (!account) {
        return forbidden(new EmailInUseError())
      }
      const token = await this.authentication.auth({ email, password })
      return ok({ token })
    } catch (error) {
      return serverError(error)
    }
  }
}
