export const Survey = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    question: { type: 'string' },
    answers: {
      type: 'array',
      items: { $ref: '#/schemas/SurveyAnswer' }
    },
    didAnswer: { type: 'boolean' },
    date: { type: 'string' }
  },
  required: ['id', 'question', 'answers', 'didAnswer', 'date']
}
