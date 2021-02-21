import { LoadAccountByTokenUseCase } from '@Application/Use-Cases/Account/Load-Account-By-Token-Use-Case'
import { LoadAccountByTokenService } from '@Data/Services/Account/Load-Account-By-Token/Load-Account-By-Token-Service'
import { JsonWebTokenAdapter } from '@Infra/Adapters/Cryptography/Json-Web-Token/Json-Web-Token-Adapter'
import { AccountMongoRepository } from '@Infra/Database/Mongo/Repositories/Account/Account-Mongo-Repository'
import Env from '@Main/Config/Env'

export const LoadAccountByTokenServiceFactory = (): LoadAccountByTokenUseCase => {
  return new LoadAccountByTokenService(
    new JsonWebTokenAdapter(Env.SECRET_KEY),
    new AccountMongoRepository()
  )
}
