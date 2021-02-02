import { RequestHandler } from 'express'
import { Controller, Request, Response } from '../../../presentation/contracts'

export const expressRouteAdapter = (controller: Controller): RequestHandler => {
  return async (req, res) => {
    const request: Request =
    {
      body: req.body
    }
    const response: Response = await controller.handle(request)
    if (response.statusCode >= 200 && response.statusCode <= 299) {
      return res.status(response.statusCode).json(response.body)
    } else {
      return res.status(response.statusCode).json({ error: response.body.message })
    }
  }
}
