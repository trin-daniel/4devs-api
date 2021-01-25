import { Controller, Request, Response } from '../../contracts'
import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'

export class SigninController implements Controller {
  handle (request: Request<any>): Promise<Response<any>> {
    return Promise.resolve(badRequest(new MissingParamError('email')))
  }
}
