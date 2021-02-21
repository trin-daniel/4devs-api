import { LogErrorRepository } from '@Data/Protocols/Database'
import { Controller, Request, Response } from '@Presentation/Protocols'

export class LogControllerDecorator implements Controller {
  constructor (
    private readonly Controller: Controller,
    private readonly LogErrorRepository: LogErrorRepository
  ) {}

  async handle (request: Request): Promise<Response> {
    const Response = await this.Controller.handle(request)
    Response.statusCode === 500 &&
    await this.LogErrorRepository.LogError(Response.body.stack)
    return Response
  }
}
