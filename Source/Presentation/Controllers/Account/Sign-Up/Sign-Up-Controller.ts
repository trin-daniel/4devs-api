import { AddAccountUseCase } from '@Application/Use-Cases/Account/Add-Account-Use-Case'
import { AuthenticationUseCase } from '@Application/Use-Cases/Authentication/Authentication-Use-Case'
import { Controller, Request, Response, Validation } from '@Presentation/Protocols'
import { BadRequest, Forbidden, Ok, ServerErrorHelper } from '@Presentation/Helpers/Http-Helper'
import { EmailInUseError } from '@Presentation/Errors'
import { AccountDTO } from '@Presentation/DTOS'
import { AuthenticationViewModel } from '@Presentation/View-Models'

export class SignUpController implements Controller {
  constructor (
    private readonly Validation: Validation,
    private readonly AddAccountUseCase: AddAccountUseCase,
    private readonly AuthenticationUseCase: AuthenticationUseCase
  ) {}

  async handle (Request: Request<AccountDTO>): Promise<Response<AuthenticationViewModel>> {
    try {
      const {
        body: {
          name,
          email,
          password,
          confirmation
        }
      } = Request
      const Error = this.Validation.Validate({ name, email, password, confirmation })
      if (Error) {
        return BadRequest(Error)
      }
      const Account = await this.AddAccountUseCase.Add({ name, email, password })
      return Account
        ? Ok(await this.AuthenticationUseCase.Auth({ email, password }))
        : Forbidden(new EmailInUseError())
    } catch (error) {
      return ServerErrorHelper(error)
    }
  }
}
