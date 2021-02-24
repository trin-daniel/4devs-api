export const SurveyResultPath = {
  put:
  {
    security: [{
      ApiKeyAuth: [] as Array<string>
    }],
    tags: ['Surveys'],
    summary: 'API para responder a enquete',
    parameters: [{
      in: 'path',
      name: 'survey_id',
      required: true,
      schema: {
        type: 'string'
      }
    }],
    requestBody: {
      description: 'Preencha todos os campos corretamente.',
      content: {
        'application/json':
        {
          schema:
          {
            $ref: '#/schemas/SaveSurvey'
          }
        }
      }
    },
    responses:
    {
      200:
      {
        description: 'Sucesso',
        content: { 'application/json': { schema: { $ref: '#/schemas/SurveyResult' } } }
      },

      403: { $ref: '#/components/Unauthorized' },
      404: { $ref: '#/components/NotFound' },
      500: { $ref: '#/components/ServerError' }
    }
  },
  get:
  {
    security: [{
      ApiKeyAuth: [] as Array<string>
    }],
    tags: ['Surveys'],
    summary: 'API consultar o resultado de uma enquete',
    parameters: [{
      in: 'path',
      name: 'survey_id',
      required: true,
      schema: {
        type: 'string'
      }
    }],
    responses:
    {
      200:
      {
        description: 'Sucesso',
        content: { 'application/json': { schema: { $ref: '#/schemas/SurveyResult' } } }
      },

      403: { $ref: '#/components/Unauthorized' },
      404: { $ref: '#/components/NotFound' },
      500: { $ref: '#/components/ServerError' }
    }
  }
}
