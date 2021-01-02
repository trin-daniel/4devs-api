import { Request, Response } from '../../contracts'
import { MissingParamError } from '../../errors'

export class SignupController {
  handle (request: Request): Response {
    if (!request.body.name) {
      return {
        statusCode: 400,
        body: new MissingParamError('name')
      }
    }
    if (!request.body.email) {
      return {
        statusCode: 400,
        body: new MissingParamError('email')
      }
    }
  }
}
