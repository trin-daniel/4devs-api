export const signInPath = {
  post:
  {
    tags: ['sign-in'],
    summary: 'API de autenticação',
    requestBody: {
      description: 'A Requisição deve possuir um body com os campos abaixo:',
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/signInSchema'
          }
        }
      }
    },
    responses: {
      200: {
        description: 'Sucesso',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/accountSchema'
            }
          }
        }
      }
    }
  }
}
