export const surveyPath = {
  get: {
    security: [{
      apiKeyAuth: [] as Array<string>
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
            { $ref: '#/schemas/surveysSchema' }
          }
        }
      },
      204: {
        description: 'Resposta sem conteudo'
      },

      403: {
        $ref: '#/components/forbidden'
      },
      404: {
        $ref: '#/components/notFound'
      },
      500: {
        $ref: '#/components/serverError'
      }
    }
  }
}
