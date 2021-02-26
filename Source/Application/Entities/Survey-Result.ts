export type SurveyResult = {
  id: string,
  question: string
  survey_id: string,
  answers: Array<{
    image?: string,
    answer: string,
    count: number,
    percent: number,
    isCurrentAccountAnswer: boolean
  }>,
  date: string
}
