import { Account } from '@Application/Entities'
import { AccountDTO } from '@Application/DTOS'
import { AddAccountUseCase } from '@Application/Use-Cases/Account/Add-Account-Use-Case'
import { AddAccountRepository, LoadAccountByEmailRepository } from '@Data/Protocols/Database'
import { Hasher } from '@Data/Protocols/Cryptography'

export class AddAccountService implements AddAccountUseCase {
  constructor (
    private readonly HasherComponent: Hasher,
    private readonly AddAccount: AddAccountRepository,
    private readonly LoadAccountByEmail: LoadAccountByEmailRepository
  ) {}

  public async Add (data: AccountDTO): Promise<Account> {
    const { email, password } = data
    const Account = await this.LoadAccountByEmail.LoadByEmail(email)
    if (!Account) {
      const Hash = await this.HasherComponent.Hash(password)
      const Account = await this.AddAccount.Add({ ...data, password: Hash })
      return Account
    }
    return null
  }
}
