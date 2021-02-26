import { AuthenticationUseCase } from '@Application/Use-Cases/Authentication/Authentication-Use-Case'
import { AuthenticationDTO } from '@Application/DTOS'
import { Encrypter, HashCompare } from '@Data/Protocols/Cryptography'
import { LoadAccountByEmailRepository, UpdateTokenRepository } from '@Data/Protocols/Database/Account'
import { Authentication } from '@Application/Entities'

export class AuthenticationService implements AuthenticationUseCase {
  constructor (
    private readonly LoadAccountByEmail: LoadAccountByEmailRepository,
    private readonly HashCompare: HashCompare,
    private readonly Encrypter: Encrypter,
    private readonly UpdateTokenRepository: UpdateTokenRepository
  ) { }

  async Auth (data: AuthenticationDTO): Promise<Authentication> {
    const { email, password } = data
    const Account = await this.LoadAccountByEmail.LoadByEmail(email)
    if (Account) {
      const IsEqual = await this.HashCompare.Compare(password, Account.password)
      if (IsEqual) {
        const Token = await this.Encrypter.Encrypt(Account.id)
        await this.UpdateTokenRepository.UpdateToken(Account.id, Token)
        return { token: Token, name: Account.name }
      }
    }
    return null
  }
}
