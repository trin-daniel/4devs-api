import { Account } from '@domain/entities'
import { LoadAccountByToken } from '@domain/use-cases/account/load-account-by-token'

import
{
  Decrypter,
  LoadAccountByTokenRepository
} from '@data/contracts'

export class LoadAccountByTokenService implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async load (token: string, role?: string): Promise<Account> {
    const decryptedValue = await this.decrypter.decrypt(token)
    if (decryptedValue) {
      const account = await this.loadAccountByTokenRepository.loadByToken(token, role)
      return account && account
    }
    return null
  }
}
