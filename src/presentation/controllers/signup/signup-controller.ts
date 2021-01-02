import { Controller, Request, Response } from '../../contracts'
import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'

export class SignupController implements Controller {
  handle (request: Request): Response {
    const requiredFields = ['name', 'email', 'password', 'confirmation']
    for (const field of requiredFields) {
      if (!request.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
  }
}
