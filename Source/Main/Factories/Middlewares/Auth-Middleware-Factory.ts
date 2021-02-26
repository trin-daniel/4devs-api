import { Middleware } from '@Presentation/Protocols'
import { AuthMiddleware } from '@Presentation/Middlewares/Auth-Middleware'
import {
  LoadAccountByTokenServiceFactory
} from '@Main/Factories/Use-Cases/Account/Load-Account-By-Token/Load-Account-By-Token-Service-Factory'

export const AuthMiddlewareFactory = (role?: string): Middleware => {
  return new AuthMiddleware(
    LoadAccountByTokenServiceFactory(),
    role
  )
}
