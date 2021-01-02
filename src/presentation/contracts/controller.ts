import { Request, Response } from '.'

export interface Controller {
  handle (request: Request): Response
}
