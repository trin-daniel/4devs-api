import { Middleware } from '../../../presentation/contracts'
import { AuthMiddleware } from '../../../presentation/middlewares/auth-middleware'
import { LoadAccountByTokenServiceFactory } from '../use-cases/account/load-account-by-token/load-account-by-token-service-factory'

export const AuthMiddlewareFactory = (role?: string): Middleware => {
  return new AuthMiddleware(LoadAccountByTokenServiceFactory(), role)
}
