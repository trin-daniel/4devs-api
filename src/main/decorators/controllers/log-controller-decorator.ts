import { LogErrorRepository } from '../../../data/contracts'
import { Controller, Request, Response } from '../../../presentation/contracts'

export class LogControllerDecorator implements Controller {
  constructor (
    private readonly controller: Controller,
    private readonly logErrorRepository: LogErrorRepository
  ) {}

  async handle (request: Request<any>): Promise<Response<any>> {
    const response = await this.controller.handle(request)
    if (response.statusCode === 500) {
      await this.logErrorRepository.logError(response.body.stack)
    }
    return response
  }
}
