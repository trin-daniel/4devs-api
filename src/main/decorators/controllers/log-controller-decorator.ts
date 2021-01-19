import { Controller, Request, Response } from '../../../presentation/contracts'

export class LogControllerDecorator implements Controller {
  constructor (
    private readonly controller: Controller
  ) {}

  async handle (request: Request<any>): Promise<Response<any>> {
    const response = await this.controller.handle(request)
    return response
  }
}
