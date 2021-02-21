export const ServerError =
{
  description: 'Erro do lado do servidor!',
  content:
   {
     'application/json':
      {
        schema: { $ref: '#schemas/Error' }
      }
   }
}
