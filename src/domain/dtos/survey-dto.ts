export interface SurveyDTO {
  question: string,
  answers: Array<{image?: string, answer: string}>,
  date: Date
}
