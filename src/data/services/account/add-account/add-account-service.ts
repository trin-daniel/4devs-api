import { AccountDTO } from '../../../../domain/data-transfer-objects'
import { Account } from '../../../../domain/entities'
import { AddAccount } from '../../../../domain/use-cases/account/add-account'
import { AddAccountRepository, Hasher, LoadAccountByEmailRepository } from '../../../contracts'

export class AddAccountService implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly accountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  public async add (data: AccountDTO): Promise<Account> {
    await this.loadAccountByEmailRepository.loadByEmail(data.email)
    const password = await this.hasher.hash(data.password)
    const account = await this.accountRepository.add({ ...data, password })
    return account
  }
}
