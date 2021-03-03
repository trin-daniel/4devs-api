import { LoadSurveyByIdUseCase } from '@Application/Use-Cases/Survey/Load-Survey-By-Id-Use-Case'
import { Controller, Request, Response } from '@Presentation/Protocols'
import { InvalidParamError } from '@Presentation/Errors'
import { Forbidden, Ok, ServerErrorHelper } from '@Presentation/Helpers/Http-Helper'
import { SaveSurveyResultUseCase } from '@Application/Use-Cases/Survey-Result/Save-Survey-Result'
import { SurveyResultViewModel } from '@Presentation/View-Models'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly LoadSurveyByIdUseCase: LoadSurveyByIdUseCase,
    private readonly SaveSurveyResultUseCase: SaveSurveyResultUseCase
  ) {}

  async handle (Request: Request): Promise<Response<SurveyResultViewModel>> {
    try {
      const { params: { survey_id }, body: { answer }, account_id } = Request
      const Survey = await this.LoadSurveyByIdUseCase.Load(survey_id)
      if (Survey) {
        const Answers = Survey.answers.map(item => item.answer)
        if (!Answers.includes(answer)) {
          return Forbidden(new InvalidParamError('answer'))
        }
      } else {
        return Forbidden(new InvalidParamError('survey_id'))
      }

      return Ok(await this.SaveSurveyResultUseCase.Save({
        survey_id,
        account_id,
        answer,
        date: new Date().toLocaleDateString('pt-br')
      }))
    } catch (error) {
      return ServerErrorHelper(error)
    }
  }
}
