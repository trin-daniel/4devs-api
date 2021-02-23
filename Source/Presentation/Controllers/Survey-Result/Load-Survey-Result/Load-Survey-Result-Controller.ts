import { LoadSurveyByIdUseCase } from '@Application/Use-Cases/Survey/Load-Survey-By-Id-Use-Case'
import { Controller, Request, Response } from '@Presentation/Protocols'

export class LoadSurveyResultController implements Controller {
  constructor (
    private readonly LoadSurveyById: LoadSurveyByIdUseCase
  ) {}

  async handle (request: Request): Promise<Response> {
    const { params: { survey_id } } = request
    await this.LoadSurveyById.Load(survey_id)
    return null
  }
}
