import { AddSurveyUseCase } from '@Application/Use-Cases/Survey/Add-Survey-Use-Case'
import { SurveyDTO } from '@Presentation/DTOS'
import { BadRequest, NoContent, ServerErrorHelper } from '@Presentation/Helpers/Http-Helper'
import { Controller, Request, Response, Validation } from '@Presentation/Protocols'

export class AddSurveyController implements Controller {
  constructor (
    private readonly Validation: Validation,
    private readonly AddSurveyUseCase: AddSurveyUseCase
  ) {}

  async handle (Request: Request<SurveyDTO>): Promise<Response<void>> {
    try {
      const {
        body: {
          question,
          answers
        }
      } = Request
      const Error = this.Validation.Validate({ question, answers })
      if (Error) {
        return BadRequest(Error)
      }
      await this.AddSurveyUseCase.Add({
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
