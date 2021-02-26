import { Middleware, Request, Response } from '@Presentation/Protocols'
import { AccessDeniedError } from '@Presentation/Errors'
import { Forbidden, Ok, ServerErrorHelper } from '@Presentation/Helpers/Http-Helper'
import { LoadAccountByTokenUseCase } from '@Application/Use-Cases/Account/Load-Account-By-Token-Use-Case'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly LoadAccountByToken: LoadAccountByTokenUseCase,
    private readonly Role?: string
  ) {}

  async handle (request: Request): Promise<Response> {
    try {
      const Token = request.headers?.['x-access-token']
      if (Token) {
        const Account = await this.LoadAccountByToken.Load(
          request.headers['x-access-token'], this.Role
        )
        if (Account) {
          return Ok({ account_id: Account.id })
        }
      }
      return Forbidden(new AccessDeniedError())
    } catch (error) {
      return ServerErrorHelper(error)
    }
  }
}
