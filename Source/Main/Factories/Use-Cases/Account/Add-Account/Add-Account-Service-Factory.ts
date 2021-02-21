import { AddAccountUseCase } from '@Application/Use-Cases/Account/Add-Account-Use-Case'
import { AddAccountService } from '@Data/Services/Account/Add-Account/Add-Account-Service'
import { BcryptAdapter } from '@Infra/Adapters/Cryptography/Bcrypt/Bcrypt-Adapter'
import { AccountMongoRepository } from '@Infra/Database/Mongo/Repositories/Account/Account-Mongo-Repository'

export const AddAccountServiceFactory = (): AddAccountUseCase => {
  return new AddAccountService(
    new BcryptAdapter(12),
    new AccountMongoRepository(),
    new AccountMongoRepository()
  )
}
