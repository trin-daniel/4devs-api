type Answer = {
  image?: string,
  answer: string
}

export type SurveyDTO = {
  question: string,
  answers: Array<Answer>,
  date: string
}
