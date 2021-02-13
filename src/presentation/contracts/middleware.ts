import { Request, Response } from '@presentation/contracts/http'

export interface Middleware {
  handle (request: Request): Promise<Response>
}
