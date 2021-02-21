import { SurveyResultDTO } from '@Application/DTOS'
import { SurveyResult } from '@Application/Entities'
import { Controller, Request, Response } from '@Presentation/Protocols'
import { InvalidParamError } from '@Presentation/Errors'
import { Forbidden, Ok, ServerErrorHelper } from '@Presentation/Helpers/Http-Helper'
import { LoadSurveyByIdUseCase } from '@Application/Use-Cases/Survey/Load-Survey-By-Id-Use-Case'
import { SaveSurveyResultUseCase } from '@Application/Use-Cases/Survey-Result/Save-Survey-Result'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly LoadSurveyById: LoadSurveyByIdUseCase,
    private readonly SaveSurveyResult: SaveSurveyResultUseCase
  ) {}

  async handle (request: Request<SurveyResultDTO>): Promise<Response<SurveyResult>> {
    try {
      const { params: { survey_id }, body: { answer }, account_id } =
      request as Request<
      SurveyResultDTO,
      {[key: string]: string},
      {[key: string]: string}
      >
      const Survey = await this.LoadSurveyById.Load(survey_id)
      if (Survey) {
        const Answers = Survey.answers.map(item => item.answer)
        if (!Answers.includes(answer)) {
          return Forbidden(new InvalidParamError('answer'))
        }
      } else {
        return Forbidden(new InvalidParamError('survey_id'))
      }

      return Ok(await this.SaveSurveyResult.Save(
        {
          survey_id,
          account_id,
          answer,
          date: new Date().toLocaleDateString('pt-br')
        }
      ))
    } catch (error) {
      return ServerErrorHelper(error)
    }
  }
}
