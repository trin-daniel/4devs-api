import { Request, Response } from '@Presentation/Protocols/Http'

export interface Middleware {
  handle (request: Request): Promise<Response>
}
