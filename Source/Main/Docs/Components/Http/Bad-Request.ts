export const BadRequest =
{
  description: 'Requisição invalida',
  content:
   {
     'Application/json':
      {
        schema: { $ref: '#schemas/Error' }
      }
   }
}
