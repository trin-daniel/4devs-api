import { SignInPath, SurveyPath } from '@Main/Docs/Paths'
import { Account, SignIn, Survey, Surveys, Error, SurveyAnswer, ApiKeyAuth } from '@Main/Docs/Schemas'
import { BadRequest, ServerError, Unauthorized, NotFound, Forbidden } from '@Main/Docs/Components/Http'

export default {
  openapi: '3.0.0',
  info:
  {
    title: '4Dev-API',
    description: 'API produzida durante o treinamento do instrutor Rodrigo Manguinho',
    version: '1.0.0'
  },
  license:
  {
    name: 'GPL-3.0-or-later',
    url: 'https://www.gnu.org/licenses/gpl-3.0-standalone.html'
  },
  servers: [{ url: '/api' }],
  tags: [{ name: 'Sign-In' }, { name: 'Surveys' }],

  paths:
  {
    '/sign-in': SignInPath,
    '/surveys': SurveyPath
  },

  schemas:
  {
    Account,
    SignIn,
    Error,
    Surveys,
    Survey,
    SurveyAnswer
  },

  components:
  {
    securitySchemes: { ApiKeyAuth },
    BadRequest,
    ServerError,
    Unauthorized,
    NotFound,
    Forbidden
  }
}
