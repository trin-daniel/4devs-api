export const SurveyPath = {
  get: {
    security: [{
      ApiKeyAuth: [] as Array<string>
    }],
    tags: ['Surveys'],
    summary: 'API para exibir todas as enquetes',
    responses: {
      200:
      {
        description: 'sucesso',
        content: {
          'application/json':
          {
            schema:
            { $ref: '#/schemas/Surveys' }
          }
        }
      },
      204: {
        description: 'Resposta sem conteudo'
      },

      403: {
        $ref: '#/components/Forbidden'
      },
      404: {
        $ref: '#/components/NotFound'
      },
      500: {
        $ref: '#/components/ServerError'
      }
    }
  },

  post: {
    security: [{
      ApiKeyAuth: [] as Array<string>
    }],
    tags: ['Surveys'],
    summary: 'API para criar enquete',
    requestBody: {
      description: 'Preencha todos os campos corretamente.',
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/AddSurvey'
          }
        }
      }
    },
    responses: {
      204: {
        description: 'Resposta sem conteudo'
      },

      403: {
        $ref: '#/components/Forbidden'
      },
      404: {
        $ref: '#/components/NotFound'
      },
      500: {
        $ref: '#/components/ServerError'
      }
    }
  }
}
