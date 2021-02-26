import { Account } from '@Application/Entities'
import { LoadAccountByTokenUseCase } from '@Application/Use-Cases/Account/Load-Account-By-Token-Use-Case'
import { Decrypter } from '@Data/Protocols/Cryptography'
import { LoadAccountByTokenRepository } from '@Data/Protocols/Database/Account'

export class LoadAccountByTokenService implements LoadAccountByTokenUseCase {
  constructor (
    private readonly Decrypter: Decrypter,
    private readonly LoadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async Load (token: string, role?: string): Promise<Account> {
    let ID: string
    try {
      ID = await this.Decrypter.Decrypt(token)
    } catch (error) {
      return null
    }
    if (ID) {
      const Account = await this.LoadAccountByTokenRepository.LoadByToken(token, role)
      return Account && Account
    }
    return null
  }
}
