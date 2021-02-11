import { LoadSurveys } from '../../../../domain/use-cases/survey/load-surveys'
import { Controller, Request, Response } from '../../../contracts'
import { ok } from '../../../helpers/http-helper'

export class LoadSurveysController implements Controller {
  constructor (
    private readonly loadSurveys: LoadSurveys
  ) {}

  async handle (request: Request): Promise<Response> {
    const surveys = await this.loadSurveys.load()
    return ok(surveys)
  }
}
