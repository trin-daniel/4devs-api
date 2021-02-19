import { signInPath } from '@main/docs/paths/sign-in-path'
import { accountSchema, signInSchema, errorSchema } from '@main/docs/schemas'

import { badRequest, serverError, unauthorized, notFound } from '@main/docs/components/http'

export default {
  openapi: '3.0.0',
  info:
  {
    title: '4dev-api',
    description: 'API produzida durante o treinamento do instrutor Rodrigo Manguinho',
    version: '1.0.0'
  },
  license:
  {
    name: 'GPL-3.0-or-later',
    url: 'https://www.gnu.org/licenses/gpl-3.0-standalone.html'
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
    signInSchema,
    errorSchema
  },

  components:
  {
    badRequest,
    serverError,
    unauthorized,
    notFound
  }
}
