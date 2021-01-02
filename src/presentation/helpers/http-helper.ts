import { Response } from '../contracts'

export const badRequest = (error: Error): Response => ({
  statusCode: 400,
  body: error
})
