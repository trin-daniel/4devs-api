export type SurveyDTO = {
  question: string,
  answers: Array<{image?: string, answer: string}>,
  date: string
}
