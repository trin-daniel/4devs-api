export const SurveyResultAnswer = {
  type: 'object',
  properties: {
    image: { type: 'string' },
    answer: { type: 'string' },
    count: { type: 'number' },
    percent: { type: 'number' }
  },
  required: ['answer', 'count', 'percent']
}
