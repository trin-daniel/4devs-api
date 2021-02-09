import { Middleware, Request, Response } from '../contracts'
import { AccessDeniedError } from '../errors'
import { forbidden } from '../helpers/http-helper'

export class AuthMiddleware implements Middleware {
  async handle (request: Request): Promise<Response> {
    return Promise.resolve(forbidden(new AccessDeniedError()))
  }
}
