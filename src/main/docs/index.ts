import { signInPath } from '@main/docs/paths/sign-in-path'
import { accountSchema, signInSchema } from '@main/docs/schemas/'

export default {
  openapi: '3.0.0',
  info:
  {
    title: '4dev-api',
    description: 'API produzida durante o treinamento do instrutor Rodrigo Manguinho',
    version: '1.0.0'
  },
  servers: [{ url: '/api' }],
  tags: [{ name: 'sign-in' }],
  paths:
  {
    '/signin': signInPath
  },
  schemas:
  {
    accountSchema,
    signInSchema
  }
}
