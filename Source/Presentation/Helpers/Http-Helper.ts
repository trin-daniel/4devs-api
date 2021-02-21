import { Response } from '@Presentation/Protocols'
import { ServerError, UnauthorizedError } from '@Presentation/Errors'

export const Ok = (data: {[key: string]:any}): Response => ({
  statusCode: 200,
  body: data
})

export const NoContent = (): Response => ({
  statusCode: 204,
  body: null
})

export const BadRequest = (error: Error): Response => ({
  statusCode: 400,
  body: error
})

export const Unauthorized = (): Response => ({
  statusCode: 401,
  body: new UnauthorizedError()
})

export const Forbidden = (error: Error): Response => ({
  statusCode: 403,
  body: error
})

export const ServerErrorHelper = (error: Error): Response => ({
  statusCode: 500,
  body: new ServerError(error.stack)
})
