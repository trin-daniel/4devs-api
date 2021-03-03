import { Account } from '@Application/Entities'
import { AccountDTO } from '@Application/DTOS'
import { AddAccountUseCase } from '@Application/Use-Cases/Account/Add-Account-Use-Case'
import { AddAccountRepository, LoadAccountByEmailRepository } from '@Data/Protocols/Database/Account'
import { Hasher } from '@Data/Protocols/Cryptography'

export class AddAccountService implements AddAccountUseCase {
  constructor (
    private readonly Hasher: Hasher,
    private readonly AddAccountRepository: AddAccountRepository,
    private readonly LoadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  public async Add (data: AccountDTO): Promise<Account> {
    const { email, password } = data
    const Account = await this.LoadAccountByEmailRepository.LoadByEmail(email)
    if (!Account) {
      const Hash = await this.Hasher.Hash(password)
      const Account = await this.AddAccountRepository.Add({ ...data, password: Hash })
      return Account
    }
    return null
  }
}
