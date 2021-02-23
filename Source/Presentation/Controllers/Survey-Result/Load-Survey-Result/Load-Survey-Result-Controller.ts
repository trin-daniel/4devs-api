import { LoadSurveyByIdUseCase } from '@Application/Use-Cases/Survey/Load-Survey-By-Id-Use-Case'
import { InvalidParamError } from '@Presentation/Errors'
import { Forbidden, ServerErrorHelper } from '@Presentation/Helpers/Http-Helper'
import { Controller, Request, Response } from '@Presentation/Protocols'

export class LoadSurveyResultController implements Controller {
  constructor (
    private readonly LoadSurveyById: LoadSurveyByIdUseCase
  ) {}

  async handle (request: Request): Promise<Response> {
    try {
      const { params: { survey_id } } = request
      const Survey = await this.LoadSurveyById.Load(survey_id)
      if (!Survey) return Forbidden(new InvalidParamError('survey_id'))
      return null
    } catch (error) {
      return ServerErrorHelper(error)
    }
  }
}
