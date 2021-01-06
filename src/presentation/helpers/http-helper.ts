import { Response } from '../contracts'
import { ServerError } from '../errors'

export const badRequest = (error: Error): Response => ({
  statusCode: 400,
  body: error
})

export const serverError = (): Response => ({
  statusCode: 500,
  body: new ServerError()
})
