export const unauthorized =
{
  description: 'Operação não permitida',
  content:
   {
     'application/json':
      {
        schema: { $ref: '#schemas/errorSchema' }
      }
   }
}
