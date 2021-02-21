import { Request, Response } from '@Presentation/Protocols'

export interface Controller {
  handle (request: Request): Promise<Response>
}
