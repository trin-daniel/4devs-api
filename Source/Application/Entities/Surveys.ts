export type Surveys = {
  id: string,
  question: string,
  answers: Array<{image?: string, answer: string}>,
  date: string
}
