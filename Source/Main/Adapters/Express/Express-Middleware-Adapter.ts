import { Middleware, Request, Response } from '@Presentation/Protocols'
import { RequestHandler } from 'express'

export const ExpressMiddlewareAdapter = (middleware: Middleware): RequestHandler => {
  return async (req, res, next) => {
    const Req: Request = {
      headers: req.headers
    }

    const Res: Response = await middleware.handle(Req)
    if (Res.statusCode === 200) {
      Object.assign(req, Req.body)
      next()
    } else {
      res.status(403).json({ error: Res.body.message })
    }
  }
}
