import { LoadSurveysUseCase } from '@Application/Use-Cases/Survey/Load-Surveys-Use-Case'
import { NoContent, Ok, ServerErrorHelper } from '@Presentation/Helpers/Http-Helper'
import { Controller, Request, Response } from '@Presentation/Protocols'
import { SurveysViewModel } from '@Presentation/View-Models'

export class LoadSurveysController implements Controller {
  constructor (
    private readonly LoadSurveysUseCase: LoadSurveysUseCase
  ) {}

  async handle (Request: Request): Promise<Response<SurveysViewModel[]>> {
    try {
      const { account_id } = Request
      const Surveys = await this.LoadSurveysUseCase.Load(account_id)
      return Surveys.length ? Ok(Surveys) : NoContent()
    } catch (error) {
      return ServerErrorHelper(error)
    }
  }
}
