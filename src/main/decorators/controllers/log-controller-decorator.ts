import { Controller, Request, Response } from '@presentation/contracts'
import { LogErrorRepository } from '@data/contracts'

export class LogControllerDecorator implements Controller {
  constructor (
    private readonly controller: Controller,
    private readonly logErrorRepository: LogErrorRepository
  ) {}

  async handle (request: Request): Promise<Response> {
    const response = await this.controller.handle(request)
    response.statusCode === 500 &&
    await this.logErrorRepository.logError(response.body.stack)
    return response
  }
}
