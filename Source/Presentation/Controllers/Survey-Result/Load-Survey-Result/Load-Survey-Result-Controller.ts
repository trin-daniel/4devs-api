import { LoadSurveyResultUseCase } from '@Application/Use-Cases/Survey-Result/Load-Survey-Result-Use-Case'
import { LoadSurveyByIdUseCase } from '@Application/Use-Cases/Survey/Load-Survey-By-Id-Use-Case'
import { SurveyResultViewModel } from '@Presentation/View-Models'
import { Controller, Request, Response } from '@Presentation/Protocols'
import { Forbidden, Ok, ServerErrorHelper } from '@Presentation/Helpers/Http-Helper'
import { InvalidParamError } from '@Presentation/Errors'

export class LoadSurveyResultController implements Controller {
  constructor (
    private readonly LoadSurveyByIdUseCase: LoadSurveyByIdUseCase,
    private readonly LoadSurveyResultUseCase: LoadSurveyResultUseCase
  ) {}

  async handle (Request: Request): Promise<Response<SurveyResultViewModel>> {
    try {
      const { params: { survey_id }, account_id } = Request
      const Survey = await this.LoadSurveyByIdUseCase.Load(survey_id)
      if (!Survey) return Forbidden(new InvalidParamError('survey_id'))
      const SurveyResult = await this.LoadSurveyResultUseCase.Load(survey_id, account_id)
      return Ok(SurveyResult)
    } catch (error) {
      return ServerErrorHelper(error)
    }
  }
}
