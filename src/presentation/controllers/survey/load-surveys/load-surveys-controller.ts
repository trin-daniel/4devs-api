import { LoadSurveys } from '../../../../domain/use-cases/survey/load-surveys'
import { Controller, Request, Response } from '../../../contracts'

export class LoadSurveysController implements Controller {
  constructor (
    private readonly loadSurveys: LoadSurveys
  ) {}

  async handle (request: Request): Promise<Response> {
    await this.loadSurveys.load()
    return Promise.resolve(null)
  }
}
