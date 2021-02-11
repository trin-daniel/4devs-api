import { LoadSurveys } from '../../../../domain/use-cases/survey/load-surveys'
import { Controller, Request, Response } from '../../../contracts'
import { ok, serverError } from '../../../helpers/http-helper'

export class LoadSurveysController implements Controller {
  constructor (
    private readonly loadSurveys: LoadSurveys
  ) {}

  async handle (request: Request): Promise<Response> {
    try {
      const surveys = await this.loadSurveys.load()
      return ok(surveys)
    } catch (error) {
      return serverError(error)
    }
  }
}
