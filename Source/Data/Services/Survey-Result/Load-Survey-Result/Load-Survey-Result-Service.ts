import { SurveyResult } from '@Application/Entities'
import { LoadSurveyResultUseCase } from '@Application/Use-Cases/Survey-Result/Load-Survey-Result-Use-Case'
import { LoadSurveyByIdRepository, LoadSurveyResultRepository } from '@Data/Protocols/Database'

export class LoadSurveyResultService implements LoadSurveyResultUseCase {
  constructor (
    private readonly LoadSurveyResult: LoadSurveyResultRepository,
    private readonly LoadSurveyByIdRepository: LoadSurveyByIdRepository
  ) {}

  async Load (survey_id: string, account_id: string):Promise<SurveyResult> {
    const Survey = await this.LoadSurveyResult.LoadBySurveyId(survey_id, account_id)
    if (!Survey) {
      const Survey = await this.LoadSurveyByIdRepository.LoadById(survey_id)
      const { id, question, answers, date } = Survey
      const Result = {
        id,
        question,
        survey_id,
        answers: answers.map(item => ({
          answer: item.answer, image: item.image, count: 0, percent: 0, isCurrentAccountAnswer: false
        })),
        date
      }
      return Result
    }
    return Survey
  }
}
