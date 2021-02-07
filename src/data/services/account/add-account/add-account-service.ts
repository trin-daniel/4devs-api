import { Account } from '../../../../domain/entities'
import { AccountDTO } from '../../../../domain/dtos'
import { AddAccount } from '../../../../domain/use-cases/account/add-account'
import { AddAccountRepository, Hasher, LoadAccountByEmailRepository } from '../../../contracts'

export class AddAccountService implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly accountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  public async add (data: AccountDTO): Promise<Account> {
    const { email, password } = data
    const account = await this.loadAccountByEmailRepository.loadByEmail(email)
    if (!account) {
      const hash = await this.hasher.hash(password)
      const account = await this.accountRepository.add({ ...data, password: hash })
      return account
    }
    return null
  }
}
