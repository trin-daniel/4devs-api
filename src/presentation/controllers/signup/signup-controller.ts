import { Request, Response } from '../../contracts'

export class SignupController {
  handle (request: Request): Response {
    if (!request.body.name) {
      return {
        statusCode: 400,
        body: new Error('Missing param: name')
      }
    }
    if (!request.body.email) {
      return {
        statusCode: 400,
        body: new Error('Missing param: email')
      }
    }
  }
}
