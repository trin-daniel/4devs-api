import { AddAccount } from '../../../domain/usecases/add-account'
import { Controller, Request, Response } from '../../contracts'
import { EmailValidator } from '../../contracts/email-validator'
import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { MissingParamError, InvalidParamError } from '../../errors'

export class SignupController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount
  ) {}

  async handle (request: Request): Promise<Response> {
    try {
      const { name, email, password, confirmation } = request.body
      const requiredFields = ['name', 'email', 'password', 'confirmation']
      for (const field of requiredFields) {
        if (!request.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      if (password !== confirmation) {
        return badRequest(new InvalidParamError('confirmation'))
      }
      const isEmail = this.emailValidator.isEmail(email)
      if (!isEmail) {
        return badRequest(new InvalidParamError('email'))
      }
      const account = await this.addAccount.add({ name, email, password })
      return ok(account)
    } catch (error) {
      return serverError()
    }
  }
}
