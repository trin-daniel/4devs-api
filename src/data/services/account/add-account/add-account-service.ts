import { AccountDTO } from '../../../../domain/data-transfer-objects'
import { Account } from '../../../../domain/entities'
import { AddAccount } from '../../../../domain/use-cases/account/add-account'
import { AddAccountRepository, Hasher } from '../../../contracts'

export class AddAccountService implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly accountRepository: AddAccountRepository
  ) {}

  public async add (data: AccountDTO): Promise<Account> {
    const password = await this.hasher.hash(data.password)
    const account = await this.accountRepository.add({ ...data, password })
    return account
  }
}
