export const Survey = {
  type: 'object',
  properties: {
    id: {
      type: 'string'
    },
    question: {
      type: 'string'
    },
    answers: {
      type: 'array',
      items: {
        $ref: '#/schemas/SurveyAnswer'
      }
    },
    date: {
      type: 'string'
    }
  }
}
