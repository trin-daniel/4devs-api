import { LoadAccountByToken } from '../../domain/use-cases/account/load-account-by-token'
import { Middleware, Request, Response } from '../contracts'
import { AccessDeniedError } from '../errors'
import { forbidden, ok } from '../helpers/http-helper'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken
  ) {}

  async handle (request: Request): Promise<Response> {
    const token = request.headers?.['x-access-token']
    if (token) {
      const account = await this.loadAccountByToken.load(request.headers['x-access-token'])
      if (account) {
        return ok({ account_id: account.id })
      }
    }
    return forbidden(new AccessDeniedError())
  }
}
