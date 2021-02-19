export const surveysSchema = {
  type: 'array',
  items: {
    $ref: '#/schemas/surveySchema'
  }
}
