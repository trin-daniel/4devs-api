import { RequestHandler } from 'express'

export const contentType: RequestHandler = (request, response, next) => {
  response.type('application/json')
  next()
}
