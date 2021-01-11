import { AccountDTO } from '../../../../domain/data-transfer-objects'
import { Account } from '../../../../domain/entities'
import { AddAccount } from '../../../../domain/use-cases/add-account'
import { Hasher } from '../../../contracts'

export class AddAccountService implements AddAccount {
  constructor (
    private readonly hasher: Hasher
  ) {}

  public async add (data: AccountDTO): Promise<Account> {
    await this.hasher.hash(data.password)
    return Promise.resolve(null)
  }
}
