import { Surveys } from '@Application/Entities'
import { LoadSurveysUseCase } from '@Application/Use-Cases/Survey/Load-Surveys-Use-Case'
import { NoContent, Ok, ServerErrorHelper } from '@Presentation/Helpers/Http-Helper'
import { Controller, Request, Response } from '@Presentation/Protocols'

export class LoadSurveysController implements Controller {
  constructor (
    private readonly LoadSurveys: LoadSurveysUseCase
  ) {}

  async handle (request: Request): Promise<Response<Surveys[]>> {
    try {
      const Surveys = await this.LoadSurveys.Load()
      return Surveys.length ? Ok(Surveys) : NoContent()
    } catch (error) {
      return ServerErrorHelper(error)
    }
  }
}
