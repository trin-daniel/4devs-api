type Answer = {
  image?: string,
  answer: string
}

export type SurveysViewModel = {
  id: string,
  question: string,
  answers: Array<Answer>,
  date: string,
  didAnswer?: boolean,
}
