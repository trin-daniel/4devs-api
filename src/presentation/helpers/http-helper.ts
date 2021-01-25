import { Response } from '../contracts'
import { ServerError, UnauthorizedError } from '../errors'

export const ok = (data: any): Response => ({
  statusCode: 200,
  body: data
})

export const badRequest = (error: Error): Response => ({
  statusCode: 400,
  body: error
})

export const unauthorized = (): Response => ({
  statusCode: 401,
  body: new UnauthorizedError()
})

export const serverError = (error: Error): Response => ({
  statusCode: 500,
  body: new ServerError(error.stack)
})
