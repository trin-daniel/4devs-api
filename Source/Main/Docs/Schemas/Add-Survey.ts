export const AddSurvey = {
  type: 'object',
  properties: {
    question: { type: 'string' },
    answers: {
      type: 'array',
      items: {
        $ref: '#/schemas/SurveyAnswer'
      }
    }
  }
}
