import { Request, Response } from './http'

export interface Middleware {
  handle (request: Request): Promise<Response>
}
