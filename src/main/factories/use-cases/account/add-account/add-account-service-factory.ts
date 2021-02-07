import { AddAccountService } from '../../../../../data/services/account/add-account/add-account-service'
import { BcryptAdapter } from '../../../../../infra/adapters/cryptography/bcrypt/bcrypt-adapter'
import { AccountMongoRepository } from '../../../../../infra/database/mongo/repositories/account/account-mongo-repository'
import { AddAccount } from '../../../../../domain/use-cases/account/add-account'

export const AddAccountServiceFactory = (): AddAccount => {
  const accountMongoRepository = new AccountMongoRepository()
  const bcryptAdapter = new BcryptAdapter(12)
  return new AddAccountService(
    bcryptAdapter,
    accountMongoRepository,
    accountMongoRepository
  )
}
