import { Middleware, Response } from '@Presentation/Protocols'
import { RequestHandler } from 'express'

export const ExpressMiddlewareAdapter = (middleware: Middleware): RequestHandler => {
  return async (req, res, next) => {
    const Req = {
      token: req.headers?.['x-access-token'],
      headers: req.headers
    }

    const Res: Response = await middleware.handle(Req)
    if (Res.statusCode === 200) {
      Object.assign(req, Res.body)
      next()
    } else {
      res.status(403).json({ error: Res.body.message })
    }
  }
}
