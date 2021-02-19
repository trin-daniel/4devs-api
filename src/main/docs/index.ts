import { signInPath, surveyPath } from '@main/docs/paths'
import { accountSchema, signInSchema, errorSchema, surveySchema, surveysSchema, surveyAnswerSchema, apiKeyAuthSchema } from '@main/docs/schemas'

import { badRequest, serverError, unauthorized, notFound, forbidden } from '@main/docs/components/http'

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
  tags: [{ name: 'sign-in' }, { name: 'Surveys' }],

  paths:
  {
    '/signin': signInPath,
    '/surveys': surveyPath
  },

  schemas:
  {
    accountSchema,
    signInSchema,
    errorSchema,
    surveysSchema,
    surveySchema,
    surveyAnswerSchema
  },

  components:
  {
    securitySchemes: {
      apiKeyAuth: apiKeyAuthSchema
    },
    badRequest,
    serverError,
    unauthorized,
    notFound,
    forbidden
  }
}
