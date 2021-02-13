import { Response } from '@presentation/contracts'
import
{
  ServerError,
  UnauthorizedError
} from '@presentation/errors'

export const ok = (data: any): Response => ({
  statusCode: 200,
  body: data
})

export const noContent = (): Response => ({
  statusCode: 204,
  body: null
})

export const badRequest = (error: Error): Response => ({
  statusCode: 400,
  body: error
})

export const unauthorized = (): Response => ({
  statusCode: 401,
  body: new UnauthorizedError()
})

export const forbidden = (error: Error): Response => ({
  statusCode: 403,
  body: error
})

export const serverError = (error: Error): Response => ({
  statusCode: 500,
  body: new ServerError(error.stack)
})
