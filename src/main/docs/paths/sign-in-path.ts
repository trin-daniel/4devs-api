export const signInPath = {
  post:
  {
    tags: ['sign-in'],
    summary: 'API de autenticação',
    requestBody: {
      description: 'Preencha todos os campos corretamente.',
      content: {
        'application/json':
        {
          schema:
          {
            $ref: '#/schemas/signInSchema'
          }
        }
      }
    },
    responses:
    {
      200:
      {
        description: 'sucesso',
        content: { 'application/json': { schema: { $ref: '#/schemas/accountSchema' } } }
      },

      400: { $ref: '#/components/badRequest' },
      401: { $ref: '#/components/unauthorized' },
      404: { $ref: '#/components/notFound' },
      500: { $ref: '#/components/serverError' }
    }
  }
}
