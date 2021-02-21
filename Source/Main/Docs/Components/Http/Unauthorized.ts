export const Unauthorized =
{
  description: 'Operação não permitida',
  content:
   {
     'application/json':
      {
        schema: { $ref: '#schemas/Error' }
      }
   }
}
