import { Response } from '../contracts'
import { ServerError } from '../errors'

export const ok = (data: any): Response => ({
  statusCode: 200,
  body: data
})

export const badRequest = (error: Error): Response => ({
  statusCode: 400,
  body: error
})

export const serverError = (): Response => ({
  statusCode: 500,
  body: new ServerError()
})
