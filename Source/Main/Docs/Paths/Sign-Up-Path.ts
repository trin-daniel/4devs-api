export const SignUpPath = {
  post:
  {
    tags: ['Sign-Up'],
    summary: 'API de Criação de contas de usuário',
    requestBody: {
      description: 'Preencha todos os campos corretamente.',
      content: {
        'application/json':
        {
          schema:
          {
            $ref: '#/schemas/SignUp'
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
