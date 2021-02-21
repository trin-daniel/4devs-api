import { RequestHandler } from 'express'

export const contentType: RequestHandler = (request, response, next) => {
  response.type('Application/json')
  next()
}
