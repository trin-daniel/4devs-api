export const SurveyResult = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    survey_id: { type: 'string' },
    question: { type: 'string' },
    answers: {
      type: 'array',
      items: { $ref: '#schemas/SurveyResultAnswer' }
    },
    date: { type: 'string' }
  },
  required: ['survey_id', 'question', 'answers', 'date']
}
