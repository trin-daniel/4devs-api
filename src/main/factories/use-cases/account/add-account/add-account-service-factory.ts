import { AddAccountService } from '../../../../../data/services/account/add-account/add-account-service'
import { BcryptAdapter } from '../../../../../infra/adapters/cryptography/bcrypt/bcrypt-adapter'
import { AccountRepository } from '../../../../../infra/database/mongo/repositories/account/account-repository'
import { AddAccount } from '../../../../../domain/use-cases/account/add-account'

export const addAccountService = (): AddAccount => {
  const accountRepository = new AccountRepository()
  const bcryptAdapter = new BcryptAdapter(12)
  return new AddAccountService(bcryptAdapter, accountRepository)
}
