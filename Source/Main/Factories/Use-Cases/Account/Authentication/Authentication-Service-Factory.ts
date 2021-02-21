import { AuthenticationUseCase } from '@Application/Use-Cases/Authentication/Authentication-Use-Case'
import { AuthenticationService } from '@Data/Services/Account/Authentication/Authentication-Service'
import { AccountMongoRepository } from '@Infra/Database/Mongo/Repositories/Account/Account-Mongo-Repository'
import { BcryptAdapter } from '@Infra/Adapters/Cryptography/Bcrypt/Bcrypt-Adapter'
import { JsonWebTokenAdapter } from '@Infra/Adapters/Cryptography/Json-Web-Token/Json-Web-Token-Adapter'
import env from '@Main/Config/Env'

export const AuthenticationServiceFactory = (): AuthenticationUseCase => {
  return new AuthenticationService(
    new AccountMongoRepository(),
    new BcryptAdapter(12),
    new JsonWebTokenAdapter(env.SECRET_KEY),
    new AccountMongoRepository()
  )
}
