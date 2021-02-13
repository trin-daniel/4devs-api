import { LoadAccountByToken } from '@domain/use-cases/account/load-account-by-token'
import { Middleware, Request, Response } from '@presentation/contracts'
import { AccessDeniedError } from '@presentation/errors'
import { forbidden, ok, serverError } from '@presentation/helpers/http-helper'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string
  ) {}

  async handle (request: Request): Promise<Response> {
    try {
      const token = request.headers?.['x-access-token']
      if (token) {
        const account = await this.loadAccountByToken.load(request.headers['x-access-token'], this.role)
        if (account) {
          return ok({ account_id: account.id })
        }
      }
      return forbidden(new AccessDeniedError())
    } catch (error) {
      return serverError(error)
    }
  }
}
