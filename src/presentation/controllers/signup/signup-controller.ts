import { Request, Response } from '../../contracts'
import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'

export class SignupController {
  handle (request: Request): Response {
    if (!request.body.name) {
      return badRequest(new MissingParamError('name'))
    }
    if (!request.body.email) {
      return badRequest(new MissingParamError('email'))
    }
  }
}
