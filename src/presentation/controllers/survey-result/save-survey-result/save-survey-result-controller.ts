import { SurveyResultDTO } from '@domain/dtos'
import { SurveyResult } from '@domain/entities'
import { SaveSurveyResult } from '@domain/use-cases/survey-result/save-survey-result'
import { LoadSurveyById } from '@domain/use-cases/survey/load-survey-by-id'
import { Controller, Request, Response } from '@presentation/contracts'
import { InvalidParamError } from '@presentation/errors'
import { forbidden, ok, serverError } from '@presentation/helpers/http-helper'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult
  ) {}

  async handle (request: Request<SurveyResultDTO>): Promise<Response<SurveyResult>> {
    try {
      const { params: { survey_id }, body: { answer }, account_id } =
      request as Request<
      SurveyResultDTO,
      {[key: string]: string},
      {[key: string]: string}
      >
      const survey = await this.loadSurveyById.load(survey_id)
      if (survey) {
        const answers = survey.answers.map(item => item.answer)
        if (!answers.includes(answer)) {
          return forbidden(new InvalidParamError('answer'))
        }
      } else {
        return forbidden(new InvalidParamError('survey_id'))
      }

      return ok(await this.saveSurveyResult.save(
        {
          survey_id,
          account_id,
          answer,
          date: new Date()
        }
      ))
    } catch (error) {
      return serverError(error)
    }
  }
}
