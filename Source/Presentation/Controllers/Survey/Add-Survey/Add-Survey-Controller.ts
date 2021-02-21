import { SurveyDTO } from '@Application/DTOS'
import { AddSurveyUseCase } from '@Application/Use-Cases/Survey/Add-Survey-Use-Case'
import { BadRequest, NoContent, ServerErrorHelper } from '@Presentation/Helpers/Http-Helper'
import { Controller, Request, Response, Validation } from '@Presentation/Protocols'

export class AddSurveyController implements Controller {
  constructor (
    private readonly ValidationComponent: Validation,
    private readonly AddSurvey: AddSurveyUseCase
  ) {}

  async handle (request: Request<SurveyDTO>): Promise<Response<any>> {
    try {
      const { body: { question, answers } } = request
      const Error = this.ValidationComponent.Validate({ question, answers })
      if (Error) {
        return BadRequest(Error)
      }
      await this.AddSurvey.Add({
        question,
        answers,
        date: new Date().toLocaleDateString('pt-br')
      })
      return NoContent()
    } catch (error) {
      return ServerErrorHelper(error)
    }
  }
}
