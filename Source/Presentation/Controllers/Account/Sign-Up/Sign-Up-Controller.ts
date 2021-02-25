import { AddAccountUseCase } from '@Application/Use-Cases/Account/Add-Account-Use-Case'
import { AuthenticationUseCase } from '@Application/Use-Cases/Authentication/Authentication-Use-Case'
import { Controller, Request, Response, Validation } from '@Presentation/Protocols'
import { BadRequest, Forbidden, Ok, ServerErrorHelper } from '@Presentation/Helpers/Http-Helper'
import { EmailInUseError } from '@Presentation/Errors'

export class SignUpController implements Controller {
  constructor (
    private readonly ValidationComponent: Validation,
    private readonly AddAccount: AddAccountUseCase,
    private readonly Authentication: AuthenticationUseCase
  ) {}

  async handle (request: Request): Promise<Response> {
    try {
      const { body: { name, email, password, confirmation } } = request
      const Error = this.ValidationComponent.Validate({ name, email, password, confirmation })
      if (Error) {
        return BadRequest(Error)
      }
      const Account = await this.AddAccount.Add({ name, email, password })
      return Account
        ? Ok(await this.Authentication.Auth({ email, password }))
        : Forbidden(new EmailInUseError())
    } catch (error) {
      return ServerErrorHelper(error)
    }
  }
}
