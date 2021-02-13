import { Request, Response } from '@presentation/contracts'

export interface Controller {
  handle (request: Request): Promise<Response>
}
