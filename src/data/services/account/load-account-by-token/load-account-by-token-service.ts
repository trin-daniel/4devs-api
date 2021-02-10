import { Account } from '../../../../domain/entities'
import { LoadAccountByToken } from '../../../../domain/use-cases/account/load-account-by-token'
import { Decrypter } from '../../../contracts'

export class LoadAccountByTokenService implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter
  ) {}

  async load (token: string, role?: string): Promise<Account> {
    await this.decrypter.decrypt(token)
    return null
  }
}
