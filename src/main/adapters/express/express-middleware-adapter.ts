import { RequestHandler } from 'express'
import { Middleware, Request, Response } from '../../../presentation/contracts'

export const ExpressMiddlewareAdapter = (middleware: Middleware): RequestHandler => {
  return async (req, res, next) => {
    const request: Request = {
      headers: req.headers
    }

    const response: Response = await middleware.handle(request)
    if (response.statusCode === 200) {
      Object.assign(req, request.body)
      next()
    } else {
      res.status(403).json({ error: response.body.message })
    }
  }
}
