import { Controller, Request, Response } from '@Presentation/Protocols'
import { RequestHandler } from 'express'

export const ExpressRouteAdapter = (controller: Controller): RequestHandler => {
  return async (req, res) => {
    const Req: Request =
    {
      body: req.body,
      params: req.params,
      account_id: req.account_id
    }
    const Res: Response = await controller.handle(Req)
    if (Res.statusCode >= 200 && Res.statusCode <= 299) {
      return res.status(Res.statusCode).json(Res.body)
    } else {
      return res.status(Res.statusCode).json({ error: Res.body.message })
    }
  }
}
