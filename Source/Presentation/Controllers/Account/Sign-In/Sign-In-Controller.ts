import { AuthenticationUseCase } from '@Application/Use-Cases/Authentication/Authentication-Use-Case'
import { AuthenticationDTO } from '@Application/DTOS'
import { Controller, Request, Response, Validation } from '@Presentation/Protocols'
import { BadRequest, Ok, Unauthorized, ServerErrorHelper } from '@Presentation/Helpers/Http-Helper'

export class SignInController implements Controller {
  constructor (
    private readonly ValidationComponent: Validation,
    private readonly Authentication: AuthenticationUseCase
  ) { }

  async handle (request: Request<AuthenticationDTO>): Promise<Response<string>> {
    try {
      const { body: { email, password } } = request
      const Error = this.ValidationComponent.Validate({ email, password })
      if (Error) {
        return BadRequest(Error)
      }
      const Credentials = await this.Authentication.Auth({ email, password })
      return !Credentials ? Unauthorized() : Ok(Credentials)
    } catch (error) {
      return ServerErrorHelper(error)
    }
  }
}
