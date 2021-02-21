export const Forbidden = {
  description: 'Accesso negado',
  content: {
    'application/json': {
      schema: {
        $ref: '#schemas/Error'
      }
    }
  }
}
