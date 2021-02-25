export const Account =
{
  type: 'object',
  properties:
  {
    token: { type: 'string' },
    name: { type: 'string' }
  },
  required: ['token', 'name']
}
