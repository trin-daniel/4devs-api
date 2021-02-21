export const SignInPath = {
  post:
  {
    tags: ['Sign-In'],
    summary: 'API de autenticação',
    requestBody: {
      description: 'Preencha todos os campos corretamente.',
      content: {
        'application/json':
        {
          schema:
          {
            $ref: '#/schemas/SignIn'
          }
        }
      }
    },
    responses:
    {
      200:
      {
        description: 'Sucesso',
        content: { 'application/json': { schema: { $ref: '#/schemas/Account' } } }
      },

      400: { $ref: '#/components/BadRequest' },
      401: { $ref: '#/components/Unauthorized' },
      404: { $ref: '#/components/NotFound' },
      500: { $ref: '#/components/ServerError' }
    }
  }
}
