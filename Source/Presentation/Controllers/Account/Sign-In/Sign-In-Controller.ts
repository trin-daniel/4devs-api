import { AuthenticationUseCase } from '@Application/Use-Cases/Authentication/Authentication-Use-Case'
import { Controller, Request, Response, Validation } from '@Presentation/Protocols'
import { BadRequest, Ok, Unauthorized, ServerErrorHelper } from '@Presentation/Helpers/Http-Helper'
import { AuthenticationDTO } from '@Presentation/DTOS'

export class SignInController implements Controller {
  constructor (
    private readonly Validation: Validation,
    private readonly AuthenticationUseCase: AuthenticationUseCase
  ) { }

  async handle (Request: Request<AuthenticationDTO>): Promise<Response<string>> {
    try {
      const {
        body: {
          email,
          password
        }
      } = Request
      const Error = this.Validation.Validate({ email, password })
      if (Error) {
        return BadRequest(Error)
      }
      const Authentication = await this.AuthenticationUseCase.Auth({ email, password })
      return !Authentication ? Unauthorized() : Ok(Authentication)
    } catch (error) {
      return ServerErrorHelper(error)
    }
  }
}
